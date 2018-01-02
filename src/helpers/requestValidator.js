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

const validDevice = (device) => {
    return !_.isUndefined(device) && !_.isUndefined(device.name) && !_.isUndefined(device.location)
        && !_.isUndefined(device.location.longitude) && !_.isUndefined(device.location.latitude);
};

export default { validUser, validObservation, validUnit, validMeasurement, validEvent, validDevice }