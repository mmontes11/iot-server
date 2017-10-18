import constants from '../utils/constants';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import deviceController from './deviceController';

const createObservations = async (req, res, next) => {
    const observations = req.body[constants.observationsArrayName];
    let createdObservations = [];
    let invalidObservations = [];
    let savePromises = [];

    for (const observation of observations) {
        try {
            const newObservation = modelFactory.createObservationUsingKind(observation, req);
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

    await createOrUpdateDeviceIfNeeded(createdObservations, req);

    handleResponse(res, createdObservations, invalidObservations);
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

const createOrUpdateDeviceIfNeeded = async (createdObservations, req) => {
    if (!_.isEmpty(createdObservations)) {
        const latestObservation = _.max(createdObservations, (observation) => {
            return observation.phenomenonTime;
        });
        return deviceController.createOrUpdateDevice(latestObservation, req);
    } else {
        return undefined;
    }
};

export default { createObservations };