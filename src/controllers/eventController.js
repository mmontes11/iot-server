import httpStatus from 'http-status';
import _ from 'underscore';
import { EventSchema, EventModel } from '../models/event';
import requestUtils from '../utils/requestUtils'

function createEvent(req, res, next) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newEvent = new EventModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        duration: req.body.duration,
    });

    newEvent.save()
        .then( savedEvent => res.json(savedEvent) )
        .catch( err => {
            res.status(httpStatus.BAD_REQUEST).json(err)
        })
}

function getTypes(req, res) {
    EventModel.types()
        .then( types => {
            if (_.isNull(types)) {
                res.sendStatus(httpStatus.NOT_FOUND)
            } else {
                res.json(types)
            }
        })
}

export default { createEvent, getTypes };