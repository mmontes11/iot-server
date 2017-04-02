import httpStatus from 'http-status';
import _ from 'underscore';
import { EventSchema, EventModel } from '../models/event';
import requestUtils from '../utils/requestUtils';

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
            res.json(types)
        })
}

function getLastEvent(req, res) {
    const type = req.params.type;
    EventModel.last(type)
        .then( lastEvent => {
            requestUtils.handleResults(res, lastEvent)
        })
}

export default { createEvent, getTypes, getLastEvent };