import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../models/timePeriod";
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
    const timePeriodParam = req.query.timePeriod;
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const address = req.query.address;
    if (!_.isUndefined(timePeriodParam)) {
        const timePeriod = new TimePeriod(timePeriodParam);
        if (!timePeriod.isValid()) {
            return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidTimePeriod]: timePeriodParam })
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
    if (!validCoordinateParams(longitude, latitude)) {
        const responseBody = {
            [serverKeys.invalidCoordinateParamsKey]: {
                [serverKeys.longitudeKey]: longitude,
                [serverKeys.latitudeKey]: latitude
            }
        };
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidCoordinateParamsKey]: responseBody });
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
    if (!validCoordinateParams(longitude, latitude)) {
        const responseBody = {
            [serverKeys.invalidCoordinateParamsKey]: {
                [serverKeys.longitudeKey]: longitude,
                [serverKeys.latitudeKey]: latitude
            }
        };
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidCoordinateParamsKey]: responseBody });
    }
    next();
};

const validCoordinateParams = (longitude, latitude) => {
    return (_.isUndefined(longitude) && _.isUndefined(latitude)) || (!_.isUndefined(longitude) && !_.isUndefined(latitude));
};

export default { validateCreateUser, validateCreateMeasurement, validateCreateEvent, validateMeasurementStats, validateCreateObservations, validateGetThings };