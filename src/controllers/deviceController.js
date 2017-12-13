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

const getDeviceFromRequest = async (req) => {
    if (!_.isUndefined(req.query.device)) {
        return req.query.device;
    } else {
        const longitude = req.query.longitude;
        const latitude = req.query.latitude;
        const maxDistance = req.query.maxDistance;
        if (!_.isUndefined(longitude) && !_.isUndefined(latitude)) {
            const devices = await DeviceModel.findDevices(longitude, latitude, maxDistance);
            return _.first(devices).name;
        } else {
            return undefined;
        }
    }
};

export default { createOrUpdateDevice, getDeviceByName, getDevices, getDeviceFromRequest };