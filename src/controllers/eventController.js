import httpStatus from 'http-status';
import _ from 'underscore';
import { EventModel } from '../models/db/event';
import modelFactory from '../models/db/modelFactory';
import responseHandler from '../helpers/responseHandler';
import deviceController from './deviceController';
import constants from '../utils/constants';

 const createEvent = async (req, res) =>{
    try {
        const newEvent = modelFactory.createEvent(req.body, req);
        const savedEvent = await newEvent.save();
        await deviceController.createOrUpdateDevice(savedEvent, req);
        res.status(httpStatus.CREATED).json(savedEvent);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const getTypes = async (req, res) => {
    try {
        const types = await EventModel.types();
        responseHandler.handleResponse(res, types, constants.typesArrayName);
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