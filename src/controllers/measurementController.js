import _ from 'underscore';
import { MeasurementSchema, MeasurementModel } from '../models/db/measurement';
import { TimePeriod, CustomTimePeriod } from '../models/request/timePeriod'
import statsCache from '../cache/statsCache';
import requestUtils from '../utils/requestUtils';
import responseHandler from '../helpers/responseHandler';

async function createMeasurement(req, res) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newMeasurement = new MeasurementModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        phenomenonTime: new Date(),
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        units: req.body.units,
        value: req.body.value
    });

    try {
        const savedMeasurement = await newMeasurement.save();
        responseHandler.handleResponse(res, savedMeasurement);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getTypes(req, res) {
    try {
        const types = await MeasurementModel.types();
        responseHandler.handleResponse(res, types);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getLastMeasurement(req, res) {
    const type = req.params.type;
    try {
       const lastMeasurements = await MeasurementModel.findLastN(1, type);
       responseHandler.handleResponse(res, _.first(lastMeasurements));
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getStats(req, res) {
    const type = req.params.type;
    let timePeriod = undefined;
    if (!_.isUndefined(req.query.lastTimePeriod)) {
        timePeriod = new TimePeriod(req.query.lastTimePeriod);
    }
    if (!_.isUndefined(req.query.startDate) || !_.isUndefined(req.query.endDate)) {
        timePeriod = new CustomTimePeriod(req.query.startDate, req.query.endDate)
    }

    try {
        if (statsCache.cachePolicy(timePeriod)) {
            const statsFromCache = await statsCache.getStatsCache(type, timePeriod);
            if (!_.isNull(statsFromCache)) {
                responseHandler.handleResponse(res, statsFromCache)
            } else {
                const statsFromDB = await getStatsFromDB(type, timePeriod);
                statsCache.setStatsCache(type, timePeriod, statsFromDB);
                responseHandler.handleResponse(res, statsFromDB);
            }
        } else {
            const statsFromDB = await getStatsFromDB(type, timePeriod);
            responseHandler.handleResponse(res, statsFromDB);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getStatsFromDB(type, timePeriod) {
    try {
        return await MeasurementModel.getStats(type, timePeriod);
    } catch (err) {
        throw err;
    }
}

export default { createMeasurement, getTypes, getLastMeasurement, getStats };