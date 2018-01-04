import constants from '../utils/constants';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import { ObservationModel } from "../models/db/observation"
import deviceController from './deviceController';

const createObservations = async (req, res, next) => {
    const observations = req.body[constants.observationsArrayName];
    let createdObservations = [];
    let invalidObservations = [];
    let savePromises = [];

    for (const observation of observations) {
        try {
            const newObservation = modelFactory.createObservationUsingKind(req, observation);
            savePromises.push(newObservation.save().reflect());
        } catch (err) {
            invalidObservations.push(observation);
        }
    }

    await Promise.all(savePromises).each((inspection, index) => {
        if (inspection.isFulfilled()) {
            createdObservations.push(inspection.value());
        } else {
            invalidObservations.push(observations[index])
        }
    });

    let deviceError;
    try {
        await createOrUpdateDeviceIfNeeded(req, createdObservations);
    } catch (err) {
        deviceError = err;
    }

    if (_.isUndefined(deviceError)) {
        handleResponse(res, createdObservations, invalidObservations);
    } else {
        handleDeviceError(req, res, createdObservations)
    }
};

const createOrUpdateDeviceIfNeeded = async (req, createdObservations) => {
    if (!_.isEmpty(createdObservations)) {
        const latestObservation = _.max(createdObservations, (observation) => {
            return observation.phenomenonTime;
        });
        return deviceController.createOrUpdateDevice(req, latestObservation.phenomenonTime);
    } else {
        return undefined;
    }
};

const handleResponse = (res, createdObservations, invalidObservations) => {
    if (_.isEmpty(createdObservations)) {
        const response = {
            [constants.invalidObservationsArrayName]: invalidObservations
        };
        return res.status(httpStatus.BAD_REQUEST).json(response);
    } else if (_.isEmpty(invalidObservations)) {
        const response = {
            [constants.createdObservationsArrayName]: createdObservations
        };
        return res.status(httpStatus.CREATED).json(response);
    } else {
        const response = {
            [constants.createdObservationsArrayName]: createdObservations,
            [constants.invalidObservationsArrayName]: invalidObservations
        };
        return res.status(httpStatus.MULTI_STATUS).json(response);
    }
};


const handleDeviceError = async (req, res, createdObservations) => {
    if (!_.isUndefined(createdObservations) && !_.isEmpty(createdObservations)) {
        try {
            await ObservationModel.removeObservations(createdObservations);
            sendDeviceErrorResponse(req, res);
        } catch (err) {
            throw err;
        }
    } else {
        sendDeviceErrorResponse(req, res);
    }
};

const sendDeviceErrorResponse = (req, res) => {
    const response = {
        invalidDevice: req.body.device
    };
    res.status(httpStatus.BAD_REQUEST).json(response);
};

export default { createObservations };