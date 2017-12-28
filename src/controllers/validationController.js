import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod";
import requestValidator from '../helpers/requestValidator';
import constants from '../utils/constants';
import errors from '../utils/errors';

const validateCreateUser = (req, res, next) => {
    if (requestValidator.validateUser(req.body)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

const validateCreateMeasurement = (req, res, next) => {
    const measurement = req.body.measurement;
    const device = req.body.device;
    if (requestValidator.validateMeasurement(measurement) && requestValidator.validateDevice(device)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

const validateCreateEvent = (req, res, next) => {
    const event = req.body.measurement;
    const device = req.body.device;
    if (requestValidator.validateCreateEvent(event) && requestValidator.validateDevice(device)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

const validateMeasurementStats = (req, res, next) => {
    const lastTimePeriodParam = req.query.lastTimePeriod;
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const address = req.query.address;
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
    if (!validRegionParams(longitude, latitude, address)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
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
    const device = req.body.device;
    if (!requestValidator.validateDevice(device)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    next();
};

const validateGetDevices = (req, res, next) => {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const address = req.query.address;
    if (!validRegionParams(longitude, latitude, address)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    next();
};

const validRegionParams = (longitude, latitude, address) => {
    const allRegionParamsUndefined = _.isUndefined(longitude) && _.isUndefined(latitude) && _.isUndefined(address);
    return  allRegionParamsUndefined || ((!_.isUndefined(longitude) && !_.isUndefined(latitude)) || !_.isUndefined(address));
};

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats, validateCreateObservations, validateGetDevices };