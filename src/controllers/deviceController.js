import _ from 'underscore';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import { DeviceModel } from "../models/db/device";
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';

const createOrUpdateDevice = async (observation, req) => {
    if (requestValidator.validateObservation(observation) && !_.isUndefined(observation.phenomenonTime)) {
        const device = await modelFactory.createDevice(observation.device, observation.phenomenonTime, req);
        return DeviceModel.upsertDevice(device);
    } else {
        return undefined;
    }
};

const getDeviceByName = async (req, res, next) => {
    const name = req.params.name;
    const device = await DeviceModel.findDeviceByName(name);
    responseHandler.handleResponse(res, device);
};

const getDevices = async (req, res, next) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const maxDistance = req.query.maxDistance;
    const devices = await DeviceModel.findDevices(longitude, latitude, maxDistance);
    responseHandler.handleResponse(res, devices, constants.devicesArrayName);
};

export default { createOrUpdateDevice, getDeviceByName, getDevices };