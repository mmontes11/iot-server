import _ from 'underscore';
import regex from '../utils/regex';

const validateUser = (user) => {
    return !_.isUndefined(user) && !_.isUndefined(user.username) && !_.isUndefined(user.password) && regex.passwordRegex.test(user.password);
};

const validateObservation = (observation) => {
    return !_.isUndefined(observation) && !_.isUndefined(observation.type) && !_.isUndefined(observation.device);
};

const validateUnit = (unit) => {
    return !_.isUndefined(unit) && !_.isUndefined(unit.name) && !_.isUndefined(unit.symbol);
};

const validateMeasurement = (measurement) => {
    return validateObservation(measurement) && validateUnit(measurement.unit) && !_.isUndefined(measurement.value);
};

const validateEvent = (event) => {
    return validateObservation(event);
};

const validateDevice = (device) => {
    return !_.isUndefined(device) && !_.isUndefined(device.name) && !_.isUndefined(device.location)
        && !_.isUndefined(device.location.longitude) && !_.isUndefined(device.location.latitude);
};

export default { validateUser, validateObservation, validateUnit, validateMeasurement, validateEvent, validateDevice }