import { EventSchema, EventModel } from '../models/event';
import requestUtils from '../utils/requestUtils';

async function createEvent(req, res) {
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

    try {
        const event = await newEvent.save();
        res.json(event)
    } catch (err) {
        requestUtils.handleError(res, err);
    }
}

async function getTypes(req, res) {
    try {
        const types = await EventModel.types();
        res.json(types);
    } catch (err) {
        requestUtils.handleError(err);
    }
}

async function getLastEvent(req, res) {
    const type = req.params.type;

    try {
        const lastEvent = await EventModel.last(type);
        res.json(lastEvent);
    } catch (err) {
        requestUtils.handleError(err);
    }
}

export default { createEvent, getTypes, getLastEvent };