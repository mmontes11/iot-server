import constants from '../utils/constants';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { ObservationKind ,supportedObservationKinds } from  '../models/request/observationKind';
import requestValidator from '../helpers/requestValidator';
import { MeasurementModel } from '../models/db/measurement';
import { EventModel } from '../models/db/event';

const createObservations = async (req, res, next) => {
    const observations = req.body[constants.observationsArrayName];
    let createdObservations = [];
    let invalidObservations = [];
    let saveToDBPromises = [];

    for (const observation of observations) {
        const observationKind = observation.kind;
        if (!_.isUndefined(observationKind) && _.contains(supportedObservationKinds, observationKind)
                && requestValidator.validateObservation(observation)) {
            saveToDBPromises.push(createSaveToDBPromise(observation));
        } else {
            invalidObservations.push(observation);
        }
    }

    await Promise.all(saveToDBPromises.map((promise) => {
        return promise.reflect();
    })).each((inspection, index) => {
        if (inspection.isFulfilled()) {
            createdObservations.push(inspection.value());
        } else {
            invalidObservations.push(observations[index])
        }
    });
    handleResponse(res, createdObservations, invalidObservations);
};

const createSaveToDBPromise = (observation) => {
    const observationKind = observation.kind;
    delete observation.kind;
    let model;
    switch (observationKind) {
        case ObservationKind.measurementKind: {
            model = new MeasurementModel(observation);
            break;
        }
        case ObservationKind.eventKind: {
            model = new EventModel(observation);
            break;
        }
    }
    return model.save();
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

export default { createObservations };