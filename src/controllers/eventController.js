import httpStatus from 'http-status';
import { EventSchema, EventModel } from '../models/db/event';
import requestUtils from '../utils/requestUtils';
import responseHandler from '../helpers/responseHandler';

async function createEvent(req, res) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newEvent = new EventModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        phenomenonTime: new Date(),
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        duration: req.body.duration,
    });

    try {
        const savedEvent = await newEvent.save();
        res.status(httpStatus.CREATED).json(savedEvent);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getTypes(req, res) {
    try {
        const types = await EventModel.types();
        responseHandler.handleResponse(res, types, "types");
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getLastEvent(req, res) {
    const type = req.params.type;
    try {
        const lastEvent = await EventModel.last(type);
        responseHandler.handleResponse(res, lastEvent);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

export default { createEvent, getTypes, getLastEvent };