import { UserModel } from './user';
import { MeasurementModel } from './measurement';
import { EventModel } from './event';
import { ObservationKind } from '../request/observationKind';
import { extractUserNameFromRequest } from '../../utils/requestUtils';
import requestValidator from '../../helpers/requestValidator';
import geoUtils from '../../utils/geoUtils';
import _ from 'underscore';

const createUser = (user) => {
    return new UserModel({
        username: user.username,
        password: user.password
    });
};

const createMeasurement = (measurement, req) => {
    const username = extractUserNameFromRequest(req);
    return new MeasurementModel({
        username: username,
        device: measurement.device,
        phenomenonTime: new Date(),
        type: measurement.type,
        relatedEntities: measurement.relatedEntities,
        unit: measurement.unit,
        value: measurement.value
    });
};

const createEvent = (event, req) => {
    const username = extractUserNameFromRequest(req);
    return new EventModel({
        username: username,
        device: event.device,
        phenomenonTime: new Date(),
        type: event.type,
        relatedEntities: event.relatedEntities,
        duration: event.duration
    });
};

const createObservationUsingKind = (observation, req) => {
    const observationKind = observation.kind;
    if (_.isUndefined(observationKind)) {
        throw Error('observation.kind path is undefined');
    }
    delete observation.kind;
    const invalidObservationError = Error('Invalid observation');
    switch (observationKind) {
        case ObservationKind.measurementKind: {
            if (requestValidator.validateMeasurement(observation)) {
                return createMeasurement(observation, req);
            } else {
                throw invalidObservationError;
            }
        }
        case ObservationKind.eventKind: {
            if (requestValidator.validateEvent(observation)) {
                return createEvent(observation, req);
            } else {
                throw invalidObservationError;
            }
        }
        default: {
            throw Error(`Unsupported observation kind: ${observationKind}`);
        }
    }
};

const createDevice = async (deviceName, lastObservation, req) => {
    try {
        let device = {
            name: deviceName,
            lastObservation: lastObservation
        };
        const deviceLocationAndIp = await geoUtils.locationAndIpFromRequest(req);
        if (!_.isUndefined(deviceLocationAndIp)) {
            device = Object.assign({}, device, deviceLocationAndIp);
        }
        return device;
    } catch(err) {
        throw err;
    }
};

export default { createUser, createMeasurement, createEvent, createObservationUsingKind, createDevice };