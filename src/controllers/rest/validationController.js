import _ from "underscore";
import httpStatus from 'http-status';
import { TimePeriod, CustomTimePeriod } from "../../models/timePeriod";
import requestValidator from '../../helpers/requestValidator';
import boolean from '../../utils/boolean';
import constants from '../../utils/responseKeys';
import serverKeys from '../../utils/responseKeys';
import regex from '../../utils/regex';

const validateCreateUserIfNotExists = (req, res, next) => {
    const user = req.body;
    if (!requestValidator.validUser(user)) {
        res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidUserKey]: user });
    } else {
        next();
    }
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
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;
    const timePeriodParam = req.query.timePeriod;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const address = req.query.address;
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
    if (!_.isUndefined(timePeriodParam)) {
        const timePeriod = new TimePeriod(timePeriodParam);
        if (!timePeriod.isValid()) {
            return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidTimePeriod]: timePeriodParam })
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
    const supportsMeasurements = req.query.supportsMeasurements;
    const supportsEvents = req.query.supportsEvents;
    if (!validCoordinateParams(longitude, latitude)) {
        const responseBody = {
            [serverKeys.invalidCoordinateParamsKey]: {
                [serverKeys.longitudeKey]: longitude,
                [serverKeys.latitudeKey]: latitude
            }
        };
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidCoordinateParamsKey]: responseBody });
    }
    if (!_.isUndefined(supportsMeasurements) && !boolean.stringIsBoolean(supportsMeasurements)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidQueryParamKey]: serverKeys.supportsMeasurementsKey });
    }
    if (!_.isUndefined(supportsEvents) && !boolean.stringIsBoolean(supportsEvents)) {
        return res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidQueryParamKey]: serverKeys.supportsEventsKey });
    }
    next();
};

const validateCreateSubscription = (req, res, next) => {
    const subscription = req.body;
    const invalidTopicId = _.isUndefined(subscription.topicId) || !regex.objectId.test(subscription.topicId);
    if (_.isUndefined(subscription) || _.isUndefined(subscription.chatId) || (_.isUndefined(subscription.topic) && invalidTopicId)) {
        res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidSubscriptionKey]: subscription });
    } else {
        next();
    }
};

const validateDeleteSubscription = (req, res, next) => {
    const subscriptionId = req.params.id;
    if (!regex.objectId.test(subscriptionId)) {
        res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidPathParamKey]: subscriptionId });
    } else {
        next();
    }
};

const validateGetSubscriptionsByChat = (req, res, next) => {
    const chatId = req.query.chatId;
    if (_.isUndefined(chatId)) {
        res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.mandatoryQueryParamKey]: serverKeys.chatIdKey })
    } else if (_.isNaN(parseInt(chatId))) {
        res.status(httpStatus.BAD_REQUEST).json({ [serverKeys.invalidQueryParamKey]: chatId })
    } else {
        next();
    }
};

const validCoordinateParams = (longitude, latitude) => {
    return (_.isUndefined(longitude) && _.isUndefined(latitude)) || (!_.isUndefined(longitude) && !_.isUndefined(latitude));
};

export default {
    validateCreateUserIfNotExists,
    validateCreateMeasurement,
    validateCreateEvent,
    validateMeasurementStats,
    validateCreateObservations,
    validateGetThings,
    validateCreateSubscription,
    validateDeleteSubscription,
    validateGetSubscriptionsByChat
};