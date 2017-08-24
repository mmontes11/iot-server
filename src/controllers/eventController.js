import httpStatus from 'http-status';
import _ from 'underscore';
import { EventModel } from '../models/db/event';
import { extractUserNameFromRequest } from '../utils/requestUtils';
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';

async function createEvent(req, res) {
    const userName = extractUserNameFromRequest(req);
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
        responseHandler.handleResponse(res, types, constants.typesArrayName);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function getLastEvent(req, res) {
    const type = req.params.type;
    try {
        const lastEvents = await EventModel.findLastN(1, type);
        responseHandler.handleResponse(res, _.first(lastEvents));
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

export default { createEvent, getTypes, getLastEvent };