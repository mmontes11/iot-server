import _ from 'underscore';
import httpStatus from 'http-status';
import { MeasurementModel } from '../../models/measurement';
import modelFactory from '../../models/modelFactory';
import { TimePeriod, CustomTimePeriod } from '../../models/timePeriod';
import statsCache from '../../cache/statsCache';
import responseHandler from '../../helpers/responseHandler';
import thingController from './thingController';
import mqttController from '../mqtt/mqttController';
import constants from '../../utils/responseKeys';

 const createMeasurement = async (req, res) => {
    let newMeasurement;
    try {
        const measurement = modelFactory.createMeasurement(req, req.body.measurement);
        newMeasurement = await measurement.save();
    } catch (err) {
        responseHandler.handleError(res, err);
    }
    let thing;
    try {
        thing = await thingController.createOrUpdateThing(req, newMeasurement.phenomenonTime);
    } catch (err) {
        await thingController.handleThingCreationError(req, res, [newMeasurement]);
    }
    await mqttController.publishMeasurement(thing, newMeasurement);
    res.status(httpStatus.CREATED).json(newMeasurement);
 };

 const getTypes = async (req, res) => {
    try {
        const types = await MeasurementModel.types();
        responseHandler.handleResponse(res, types, constants.typesArrayKey);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getLastMeasurement = async (req, res) => {
    const type = req.query.type;
    try {
       const lastMeasurements = await MeasurementModel.findLastN(1, type);
       responseHandler.handleResponse(res, _.first(lastMeasurements));
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getStats = async (req, res) => {
    const type = req.query.type;
    let timePeriod = undefined;
    if (!_.isUndefined(req.query.startDate) || !_.isUndefined(req.query.endDate)) {
        timePeriod = new CustomTimePeriod(req.query.startDate, req.query.endDate)
    }
    if (!_.isUndefined(req.query.timePeriod)) {
        timePeriod = new TimePeriod(req.query.timePeriod);
    }

    try {
        let thing;
        if (!_.isUndefined(req.query.thing) || !_.isUndefined(req.query.address) ||
                (!_.isUndefined(req.query.longitude) && !_.isUndefined(req.query.latitude))) {
            
            thing = await thingController.getThingNameFromRequest(req);
            if (_.isUndefined(thing)) {
                return res.sendStatus(httpStatus.NOT_FOUND);
            }
        }

        if (statsCache.cachePolicy(timePeriod)) {
            const statsFromCache = await statsCache.getStatsCache(type, thing, timePeriod);
            if (!_.isNull(statsFromCache)) {
                responseHandler.handleResponse(res, statsFromCache, constants.statsArrayKey)
            } else {
                const statsFromDB = await getStatsFromDB(type, thing, timePeriod);
                statsCache.setStatsCache(type, thing, timePeriod, statsFromDB);
                responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
            }
        } else {
            const statsFromDB = await getStatsFromDB(type, thing, timePeriod);
            responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getStatsFromDB = async (type, thing, timePeriod) => {
    try {
        return await MeasurementModel.getStats(type, thing, timePeriod);
    } catch (err) {
        throw err;
    }
};

export default { createMeasurement, getTypes, getLastMeasurement, getStats };