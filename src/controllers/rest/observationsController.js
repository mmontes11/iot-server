import constants from '../../utils/responseKeys';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../../helpers/requestValidator';
import modelFactory from '../../models/modelFactory';
import { ObservationModel } from "../../models/observation"
import thingController from './thingController';
import mqttController from '../mqtt/mqttController';

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
    let thing;
    try {
        if (!_.isEmpty(createdObservations)) {
            thing = await createOrUpdateThing(req, createdObservations);
        }
    } catch (err) {
        return await thingController.handleThingCreationError(req, res, createdObservations);
    }
    await mqttController.publishObservations(thing, createdObservations);
    handleResponse(res, createdObservations, invalidObservations);
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