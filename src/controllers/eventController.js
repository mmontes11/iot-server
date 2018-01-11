import httpStatus from 'http-status';
import _ from 'underscore';
import { EventModel } from '../models/db/event';
import modelFactory from '../models/db/modelFactory';
import responseHandler from '../helpers/responseHandler';
import thingController from './thingController';
import constants from '../utils/responseKeys';

 const createEvent = async (req, res) => {
    try {
        const newEvent = modelFactory.createEvent(req, req.body.event);
        const savedEvent = await newEvent.save();
        try {
            await thingController.createOrUpdateThing(req, savedEvent.phenomenonTime);
            res.status(httpStatus.CREATED).json(savedEvent);
        } catch (err) {
            await thingController.handleThingCreationError(req, res, [savedEvent]);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const getTypes = async (req, res) => {
    try {
        const types = await EventModel.types();
        responseHandler.handleResponse(res, types, constants.typesArrayKey);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getLastEvent = async (req, res) => {
    const type = req.query.type;
    try {
        const lastEvents = await EventModel.findLastN(1, type);
        responseHandler.handleResponse(res, _.first(lastEvents));
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

export default { createEvent, getTypes, getLastEvent };