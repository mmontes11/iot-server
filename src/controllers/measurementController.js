import _ from 'underscore';
import httpStatus from 'http-status';
import { MeasurementModel } from '../models/db/measurement';
import { TimePeriod, CustomTimePeriod } from '../models/request/timePeriod';
import { cachePolicy, setStatsCache, getStatsCache } from '../cache/statsCache';
import { extractUserNameFromRequest } from '../utils/requestUtils';
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';

async function createMeasurement(req, res) {
    const userName = extractUserNameFromRequest(req);
    const newMeasurement = new MeasurementModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        phenomenonTime: new Date(),
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        unit: req.body.unit,
        value: req.body.value
    });

    try {
        const savedMeasurement = await newMeasurement.save();
        res.status(httpStatus.CREATED).json(savedMeasurement);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getTypes(req, res) {
    try {
        const types = await MeasurementModel.types();
        responseHandler.handleResponse(res, types, constants.typesArrayName);
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
        if (cachePolicy(timePeriod)) {
            const statsFromCache = await getStatsCache(type, timePeriod);
            if (!_.isNull(statsFromCache)) {
                responseHandler.handleResponse(res, statsFromCache, constants.statsArrayName)
            } else {
                const statsFromDB = await getStatsFromDB(type, timePeriod);
                setStatsCache(type, timePeriod, statsFromDB);
                responseHandler.handleResponse(res, statsFromDB, constants.statsArrayName);
            }
        } else {
            const statsFromDB = await getStatsFromDB(type, timePeriod);
            responseHandler.handleResponse(res, statsFromDB, constants.statsArrayName);
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