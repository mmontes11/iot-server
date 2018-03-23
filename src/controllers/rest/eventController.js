import httpStatus from 'http-status';
import _ from 'underscore';
import { EventModel } from '../../models/event';
import modelFactory from '../../models/modelFactory';
import responseHandler from '../../helpers/responseHandler';
import thingController from './thingController';
import mqttController from '../mqtt/mqttController';
import constants from '../../utils/responseKeys';

 const createEvent = async (req, res) => {
    let newEvent;
    try {
        const event = modelFactory.createEvent(req, req.body.event);
        newEvent = await event.save();
    } catch (err) {
        return responseHandler.handleError(res, err);
    }
    let thing;
    try {
        thing = await thingController.createOrUpdateThing(req, newEvent.phenomenonTime);
    } catch (err) {
        return await thingController.handleThingCreationError(req, res, [newEvent]);
    }
    await mqttController.publishEvent(thing, newEvent);
    res.status(httpStatus.CREATED).json(newEvent);
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