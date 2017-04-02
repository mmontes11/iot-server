import httpStatus from 'http-status';
import _ from 'underscore';
import { MeasurementSchema, MeasurementModel } from '../models/measurement';
import { TimePeriod, CustomTimePeriod } from '../models/timePeriod'
import requestUtils from '../utils/requestUtils';
import statsCache from '../cache/statsCache';


function createMeasurement(req, res) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newMeasurement = new MeasurementModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        units: req.body.units,
        value: req.body.value
    });

    newMeasurement.save()
        .then( savedMeasurement => res.json(savedMeasurement) )
        .catch( err => {
            res.status(httpStatus.BAD_REQUEST).json(err);
        })
}

function getTypes(req, res) {
    MeasurementModel.types()
        .then( types => {
            if (_.isNull(types)) {
                res.sendStatus(httpStatus.NOT_FOUND)
            } else {
                res.json(types)
            }
        })
}

function getLastMeasurement(req, res) {
    const type = req.params.type;
    MeasurementModel.last(type)
        .then( lastMeasurement => {
            if (_.isNull(lastMeasurement)) {
                res.sendStatus(httpStatus.NOT_FOUND)
            } else {
                res.json(lastMeasurement)
            }
        })
}

function getStats(req, res) {
    const type = req.params.type;
    var timePeriod = undefined;
    if (!_.isUndefined(req.query.lastTimePeriod)) {
        timePeriod = new TimePeriod(req.query.lastTimePeriod);
    }
    if (!_.isUndefined(req.query.startDate) || !_.isUndefined(req.query.endDate)) {
        timePeriod = new CustomTimePeriod(req.query.startDate, req.query.endDate)
    }

    if (statsCache.cachePolicy(timePeriod)) {
        statsCache
            .getStatsCache(type, timePeriod)
            .then( cachedStats => {
                if (cachedStats){
                    getStatsSuccess(res, cachedStats)
                } else {
                    MeasurementModel
                        .getStats(type, timePeriod)
                        .then( stats => {
                            statsCache.setStatsCache(type, timePeriod, stats);
                            getStatsSuccess(res, stats)
                        })
                }
            });
    } else {
        MeasurementModel
            .getStats(type, timePeriod)
            .then( stats => {
                getStatsSuccess(res, stats)
            })
    }


}

function getStatsSuccess(res, stats) {
    if (_.isEmpty(stats)) {
        res.sendStatus(httpStatus.NOT_FOUND)
    } else {
        res.json(stats)
    }
}

export default { createMeasurement, getTypes, getLastMeasurement, getStats };