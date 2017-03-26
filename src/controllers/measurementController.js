import httpStatus from 'http-status';
import _ from 'underscore';
import { MeasurementSchema, MeasurementModel } from '../models/measurement';
import { TimePeriod } from '../models/timePeriod'
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
    var lastTimePeriod = undefined;
    if (!_.isUndefined(req.query.lastTimePeriod)) {
        lastTimePeriod = new TimePeriod(req.query.lastTimePeriod);
    }
    statsCache
        .getStatsCache(type, lastTimePeriod)
        .then( cachedStats => {
            if (cachedStats){
                getStatsSuccess(res, cachedStats)
            } else {
                MeasurementModel
                    .getStats(type, lastTimePeriod)
                    .then( stats => {
                        statsCache.setStatsCache(type, lastTimePeriod, stats);
                        getStatsSuccess(res, stats)
                    })
            }
        });
}

function getStatsSuccess(res, stats) {
    if (_.isEmpty(stats)) {
        res.sendStatus(httpStatus.NOT_FOUND)
    } else {
        res.json(stats)
    }
}

export default { createMeasurement, getLastMeasurement, getStats };