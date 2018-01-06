import _ from 'underscore';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import { DeviceModel } from "../models/db/device";
import responseHandler from '../helpers/responseHandler';
import constants from '../utils/constants';
import geocoder from '../utils/geocoder';

const createOrUpdateDevice = (req, lastObservation) => {
    const deviceToUpsert = modelFactory.createDevice(req, lastObservation);
    return DeviceModel.upsertDevice(deviceToUpsert);
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

const handleDeviceCreationError = async (req, res, createdObservations) => {
    if (!_.isUndefined(createdObservations) && !_.isEmpty(createdObservations)) {
        try {
            const removePromises = _.map(createdObservations, (observation) => {
                return observation.remove();
            });
            await Promise.all(removePromises);
            _sendDeviceErrorResponse(req, res);
        } catch (err) {
            responseHandler.handleError(req, res);
        }
    } else {
        _sendDeviceErrorResponse(req, res);
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

const _sendDeviceErrorResponse = (req, res) => {
    const response = {
        [constants.invalidDeviceKey]: req.body.device
    };
    res.status(httpStatus.BAD_REQUEST).json(response);
};

export default { createOrUpdateDevice, getDeviceByName, getDevices, getDeviceNameFromRequest, handleDeviceCreationError };