import constants from '../utils/constants';
import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../helpers/requestValidator';
import observationFactory from '../models/db/observationFactory';

const createObservations = async (req, res, next) => {
    const observations = req.body[constants.observationsArrayName];
    let createdObservations = [];
    let invalidObservations = [];
    let saveToDBPromises = [];

    for (const observation of observations) {
        if (requestValidator.validateObservation(observation)) {
            try {
                const newObservation = observationFactory.createObservation(observation);
                saveToDBPromises.push(newObservation.save());
            } catch (err) {
                invalidObservations.push(observation);
            }
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