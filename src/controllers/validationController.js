import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod";
import requestValidator from '../helpers/requestValidator';
import constants from '../utils/constants';
import errors from '../utils/errors';

const validateCreateUser = (req, res, next) => {
    validateBody(req, res, next, requestValidator.validateUser);
};

const validateCreateMeasurement = (req, res, next) => {
    validateBody(req, res, next, requestValidator.validateMeasurement);
};

const validateCreateEvent = (req, res, next) => {
    validateBody(req, res, next, requestValidator.validateEvent);
};

const validateMeasurementStats = (req, res, next) => {
    const lastTimePeriodParam = req.query.lastTimePeriod;
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;
    if (!_.isUndefined(lastTimePeriodParam)) {
        if (!_.isUndefined(startDateParam) || !_.isUndefined(endDateParam)) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        const lastTimePeriod = new TimePeriod(lastTimePeriodParam);
        if (!lastTimePeriod.isValid()) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
    }
    if (!_.isUndefined(startDateParam) || !_.isUndefined(endDateParam)) {
        const timePeriod = new CustomTimePeriod(startDateParam, endDateParam);
        if (!timePeriod.isValid()) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }
    }
    next();
};

const validateCreateObservations = (req, res, next) => {
    const observations = req.body[constants.observationsArrayName];
    if (_.isUndefined(observations) || !_.isArray(observations)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (_.isEmpty(observations)) {
        return res.sendStatus(httpStatus.NOT_MODIFIED);
    }
    const firstObservation = _.first(observations);
    const observationHaveSameDevice = _.every(observations, (observation) => {
        return _.isEqual(observation.device, firstObservation.device)
    });
    if (!observationHaveSameDevice) {
        return res.status(httpStatus.BAD_REQUEST).json(errors.observationsMustHaveSameDeviceError);
    }
    next();
};

const validateBody = (req, res, next, isValid) => {
    if (isValid(req.body)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats, validateCreateObservations };