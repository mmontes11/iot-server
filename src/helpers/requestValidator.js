import _ from 'underscore';
import regex from '../utils/regex';

const validUser = (user) => {
    return !_.isUndefined(user) && !_.isUndefined(user.username) && !_.isUndefined(user.password) && regex.passwordRegex.test(user.password);
};

const validObservation = (observation) => {
    return !_.isUndefined(observation) && !_.isUndefined(observation.type);
};

const validUnit = (unit) => {
    return !_.isUndefined(unit) && !_.isUndefined(unit.name) && !_.isUndefined(unit.symbol);
};

const validMeasurement = (measurement) => {
    return validObservation(measurement) && validUnit(measurement.unit) && !_.isUndefined(measurement.value);
};

const validEvent = (event) => {
    return validObservation(event);
};

const validThing = (thing) => {
    return !_.isUndefined(thing) && !_.isUndefined(thing.name) && !_.isUndefined(thing.geometry);
};

export default { validUser, validObservation, validUnit, validMeasurement, validEvent, validThing }