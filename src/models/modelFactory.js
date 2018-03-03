import { UserModel } from './user';
import { MeasurementModel } from './measurement';
import { EventModel } from './event';
import { ObservationKind } from './observationKind';
import { SubscriptionModel } from "./subscription"
import requestValidator from '../helpers/requestValidator';
import request from '../utils/request';
import ip from '../utils/ip';
import geojson from '../utils/geojson';
import _ from 'underscore';

const createUser = (user) => {
    return new UserModel({
        username: user.username,
        password: user.password
    });
};

const createMeasurement = (req, measurement) => {
    const username = request.extractUserNameFromRequest(req);
    const thing = req.body.thing;
    return new MeasurementModel({
        username: username,
        thing: thing.name,
        phenomenonTime: new Date(),
        type: measurement.type,
        unit: measurement.unit,
        value: measurement.value
    });
};

const createEvent = (req, event) => {
    const username = request.extractUserNameFromRequest(req);
    const thing = req.body.thing;
    return new EventModel({
        username: username,
        thing: thing.name,
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

const createThing = (req, lastObservation) => {
    const thing = req.body.thing;
    try {
        const thingIp = ip.extractIPfromRequest(req);
        const { latitude, longitude } = geojson.latLangFromGeometry(thing.geometry);
        const thingExtraFields = {
            ip: thingIp,
            lastObservation,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        };
        return Object.assign({}, thing, thingExtraFields);
    } catch(err) {
        throw err;
    }
};

const createSubscription = (req) => {
    const subscription = req.body;
    return new SubscriptionModel({
        type: subscription.type,
        chatId: subscription.chatId,
        thing: subscription.thing,
        observationType: subscription.observationType
    });
};

export default {
    createUser,
    createMeasurement,
    createEvent,
    createObservationUsingKind,
    createThing,
    createSubscription
};