import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod";
import requestValidator from '../helpers/requestValidator';
import constants from '../utils/responseKeys';
import serverKeys from '../utils/responseKeys';

const validateCreateUser = (req, res, next) => {
    const user = req.body;
    if (!requestValidator.validUser(user)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidUserKey]: user });
    }
    next();
};

const validateCreateMeasurement = (req, res, next) => {
    const measurement = req.body.measurement;
    const thing = req.body.thing;
    if (!requestValidator.validMeasurement(measurement)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidMeasurementKey]: measurement });
    }
    if (!requestValidator.validThing(thing)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidThingKey]: thing });
    }
    next();
};

const validateCreateEvent = (req, res, next) => {
    const event = req.body.event;
    const thing = req.body.thing;
    if (!requestValidator.validEvent(event)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidEventKey]: event });
    }
    if (!requestValidator.validThing(thing)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidThingKey]: thing });
    }
    next();
};

const validateMeasurementStats = (req, res, next) => {
    const lastTimePeriodParam = req.query.lastTimePeriod;
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const address = req.query.address;
    if (!_.isUndefined(lastTimePeriodParam)) {
        const lastTimePeriod = new TimePeriod(lastTimePeriodParam);
        if (!lastTimePeriod.isValid()) {
            return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidLastTimePeriodKey]: lastTimePeriodParam })
        }
    }
    if (!_.isUndefined(startDateParam) || !_.isUndefined(endDateParam)) {
        const timePeriod = new CustomTimePeriod(startDateParam, endDateParam);
        if (!timePeriod.isValid()) {
            const responseBody = {
                [serverKeys.invalidDateRangeKey]: {
                    [serverKeys.startDateKey]: startDateParam,
                    [serverKeys.endDateKey]: endDateParam
                }
            };
            return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidDateRangeKey]: responseBody });
        }
    }
    if (!validRegionParams(longitude, latitude, address)) {
        const responseBody = {
            [serverKeys.invalidRegionParamsKey]: {
                [serverKeys.longitudeKey]: longitude,
                [serverKeys.latitudeKey]: latitude,
                [serverKeys.addressKey]: address
            }
        };
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidRegionParamsKey]: responseBody });
    }
    next();
};

const validateCreateObservations = (req, res, next) => {
    const observations = req.body.observations;
    if (_.isUndefined(observations) || !_.isArray(observations)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidObservationsArrayKey]: observations });
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
        const responseBody = {
            [serverKeys.invalidRegionParamsKey]: {
                [serverKeys.longitudeKey]: longitude,
                [serverKeys.latitudeKey]: latitude,
                [serverKeys.addressKey]: address
            }
        };
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidRegionParamsKey]: responseBody });
    }
    next();
};

const validRegionParams = (longitude, latitude, address) => {
    const allRegionParamsUndefined = _.isUndefined(longitude) && _.isUndefined(latitude) && _.isUndefined(address);
    return  allRegionParamsUndefined || ((!_.isUndefined(longitude) && !_.isUndefined(latitude)) || !_.isUndefined(address));
};

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats, validateCreateObservations, validateGetThings };