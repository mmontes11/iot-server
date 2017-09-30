import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod";
import requestValidator from '../helpers/requestValidator';

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

const validateBody = (req, res, next, isValid) => {
    if (isValid(req.body)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats };