import constants from '../../utils/responseKeys';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../../helpers/requestValidator';
import modelFactory from '../../models/modelFactory';
import { ObservationModel } from "../../models/observation"
import thingController from './thingController';

const createObservations = async (req, res, next) => {
    const observations = req.body[constants.observationsArrayKey];
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

    try {
        if (!_.isEmpty(createdObservations)) {
            await createOrUpdateThing(req, createdObservations);
        }
        handleResponse(res, createdObservations, invalidObservations);
    } catch (err) {
        await thingController.handleThingCreationError(req, res, createdObservations);
    }
};

const createOrUpdateThing = async (req, createdObservations) => {
    const latestObservation = _.max(createdObservations, (observation) => {
        return observation.phenomenonTime;
    });
    return thingController.createOrUpdateThing(req, latestObservation.phenomenonTime);
};

const handleResponse = (res, createdObservations, invalidObservations) => {
    if (_.isEmpty(createdObservations)) {
        const response = {
            [constants.invalidObservationsArrayKey]: invalidObservations
        };
        return res.status(httpStatus.BAD_REQUEST).json(response);
    } else if (_.isEmpty(invalidObservations)) {
        const response = {
            [constants.createdObservationsArrayKey]: createdObservations
        };
        return res.status(httpStatus.CREATED).json(response);
    } else {
        const response = {
            [constants.createdObservationsArrayKey]: createdObservations,
            [constants.invalidObservationsArrayKey]: invalidObservations
        };
        return res.status(httpStatus.MULTI_STATUS).json(response);
    }
};

export default { createObservations };