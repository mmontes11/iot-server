import { UserModel } from './user';
import { MeasurementModel } from './measurement';
import { EventModel } from './event';
import { ObservationKind } from '../request/observationKind';
import requestValidator from '../../helpers/requestValidator';
import request from '../../utils/request';
import ip from '../../utils/ip';
import _ from 'underscore';

const createUser = (user) => {
    return new UserModel({
        username: user.username,
        password: user.password
    });
};

const createMeasurement = (req, measurement) => {
    const username = request.extractUserNameFromRequest(req);
    const device = req.body.device;
    return new MeasurementModel({
        username: username,
        device: device.name,
        phenomenonTime: new Date(),
        type: measurement.type,
        unit: measurement.unit,
        value: measurement.value
    });
};

const createEvent = (req, event) => {
    const username = request.extractUserNameFromRequest(req);
    const device = req.body.device;
    return new EventModel({
        username: username,
        device: device.name,
        phenomenonTime: new Date(),
        type: event.type,
        duration: event.duration
    });
};

const createObservationUsingKind = (req, observation) => {
    const observationKind = observation.kind;
    if (_.isUndefined(observationKind)) {
        throw Error('observation.kind path is undefined');
    }
    delete observation.kind;
    const invalidObservationError = Error('Invalid observation');
    switch (observationKind) {
        case ObservationKind.measurementKind: {
            if (requestValidator.validMeasurement(observation)) {
                return createMeasurement(req, observation);
            } else {
                throw invalidObservationError;
            }
        }
        case ObservationKind.eventKind: {
            if (requestValidator.validEvent(observation)) {
                return createEvent(req, observation);
            } else {
                throw invalidObservationError;
            }
        }
        default: {
            throw Error(`Unsupported observation kind: ${observationKind}`);
        }
    }
};

const createDevice = (req, lastObservation) => {
    const device = req.body.device;
    try {
        const deviceIp = ip.extractIPfromRequest(req);
        const deviceExtraFields = {
            ip: deviceIp,
            lastObservation
        };
        return Object.assign({}, device, deviceExtraFields);
    } catch(err) {
        throw err;
    }
};

export default { createUser, createMeasurement, createEvent, createObservationUsingKind, createDevice };