import _ from 'underscore';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import { DeviceModel } from "../models/db/device";
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';
import geocoder from '../utils/geocoder';

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
    try {
        const device = await DeviceModel.findDeviceByName(name);
        responseHandler.handleResponse(res, device);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const getDevices = async (req, res, next) => {
    try {
        const devices = await _getDevices(req);
        responseHandler.handleResponse(res, devices, constants.devicesArrayName);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const getDeviceNameFromRequest = async (req) => {
    if (!_.isUndefined(req.query.device)) {
        return req.query.device;
    } else {
        let devices;
        try {
            devices = await _getDevices(req);
        } catch (err) {
            throw err;
        }
        const firstDevice = _.first(devices);
        return _.isUndefined(firstDevice) ? undefined : firstDevice.name;
    }
};

const _getDevices = async (req) => {
    let longitude = req.query.longitude;
    let latitude = req.query.latitude;
    const address = req.query.address;
    const maxDistance = req.query.maxDistance;

    if (!_.isUndefined(address)) {
        const location = await geocoder.geocode(address);
        if (!_.isUndefined(location)) {
            longitude = location.longitude;
            latitude = location.latitude;
        } else {
            return [];
        }
    }

    try {
        return await DeviceModel.findDevices(longitude, latitude, maxDistance);
    } catch (err) {
        throw err;
    }
};

export default { createOrUpdateDevice, getDeviceByName, getDevices, getDeviceNameFromRequest };