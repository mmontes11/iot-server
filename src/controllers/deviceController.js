import _ from 'underscore';
import requestValidator from '../helpers/requestValidator';
import modelFactory from '../models/db/modelFactory';
import { DeviceModel } from "../models/db/device"

const createOrUpdateDevice = async (observation, req) => {
    if (requestValidator.validateObservation(observation) && !_.isUndefined(observation.phenomenonTime)) {
        const device = await modelFactory.createDevice(observation.device, observation.phenomenonTime, req);
        return DeviceModel.upsertDevice(device);
    } else {
        return undefined;
    }
};

export default { createOrUpdateDevice };