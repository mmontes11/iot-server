import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod";
import requestValidator from '../helpers/requestValidator';
import constants from '../utils/responseKeys';

const validateCreateUser = (req, res, next) => {
    if (requestValidator.validUser(req.body)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

const validateCreateMeasurement = (req, res, next) => {
    const measurement = req.body.measurement;
    const thing = req.body.thing;
    if (requestValidator.validMeasurement(measurement) && requestValidator.validThing(thing)) {
        next();
    } else {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

const validateCreateEvent = (req, res, next) => {
    const event = req.body.event;
    const thing = req.body.thing;
    if (requestValidator.validEvent(event) && requestValidator.validThing(thing)) {
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
    const thing = req.body.thing;
    if (!requestValidator.validThing(thing)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [constants.invalidThingKey]: thing });
    }
    next();
};

const validateGetThings = (req, res, next) => {
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

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats, validateCreateObservations, validateGetThings };