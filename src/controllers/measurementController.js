import httpStatus from 'http-status';
import measurement from '../models/measurement';
import requestUtils from '../utils/requestUtils'
import _ from 'underscore';

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

function getStats(req, res) {
    const type = req.params.type;
    measurement.MeasurementModel.getStats(type)
        .then( stats => {
            if (_.isEmpty(stats)) {
                res.sendStatus(httpStatus.NOT_FOUND)
            } else {
                res.json(stats)
            }
        })
        .catch( err => {
            res.status(httpStatus.BAD_REQUEST).json(err);
        })
}

export default { createMeasurement, getStats };