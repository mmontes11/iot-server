import httpStatus from 'http-status';
import _ from 'underscore';
import measurement from '../models/measurement';
import requestUtils from '../utils/requestUtils';
import statsCache from '../cache/statsCache';


function createMeasurement(req, res) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newMeasurement = new measurement.MeasurementModel({
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
    measurement.MeasurementModel.last(type)
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
    statsCache
        .getStatsCache(type)
        .then( cachedStats => {
            if (cachedStats){
                getStatsSuccess(res, cachedStats)
            } else {
                measurement.MeasurementModel
                    .getStats(type)
                    .then( stats => {
                        statsCache.setStatsCache(type, stats);
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