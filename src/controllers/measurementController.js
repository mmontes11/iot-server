import _ from 'underscore';
import httpStatus from 'http-status';
import { MeasurementModel } from '../models/db/measurement';
import modelFactory from '../models/db/modelFactory';
import { TimePeriod, CustomTimePeriod } from '../models/request/timePeriod';
import statsCache from '../cache/statsCache';
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';

 const createMeasurement = async (req, res) => {
    try {
        const newMeasurement = modelFactory.createMeasurement(req.body, req);
        const savedMeasurement = await newMeasurement.save();
        res.status(httpStatus.CREATED).json(savedMeasurement);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getTypes = async (req, res) => {
    try {
        const types = await MeasurementModel.types();
        responseHandler.handleResponse(res, types, constants.typesArrayName);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getLastMeasurement = async (req, res) => {
    const type = req.params.type;
    try {
       const lastMeasurements = await MeasurementModel.findLastN(1, type);
       responseHandler.handleResponse(res, _.first(lastMeasurements));
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getStats = async (req, res) => {
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
                responseHandler.handleResponse(res, statsFromCache, constants.statsArrayName)
            } else {
                const statsFromDB = await getStatsFromDB(type, timePeriod);
                statsCache.setStatsCache(type, timePeriod, statsFromDB);
                responseHandler.handleResponse(res, statsFromDB, constants.statsArrayName);
            }
        } else {
            const statsFromDB = await getStatsFromDB(type, timePeriod);
            responseHandler.handleResponse(res, statsFromDB, constants.statsArrayName);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getStatsFromDB = async (type, timePeriod) => {
    try {
        return await MeasurementModel.getStats(type, timePeriod);
    } catch (err) {
        throw err;
    }
};

export default { createMeasurement, getTypes, getLastMeasurement, getStats };