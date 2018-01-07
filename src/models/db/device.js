import mongoose from '../../lib/mongoose';
import constants from '../../utils/constants';
import _ from 'underscore';
import regex from '../../utils/regex';

const SupportedObservationTypesSchema = mongoose.Schema({
    measurement: [{
        type: String
    }],
    event: [{
        type: String
    }]
});

const DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    ip: {
        type: String,
        required: true,
        match: regex.ipRegex
    },
    geometry: {
        type: mongoose.Schema.Types.GeoJSON,
        required: true,
        index: '2dsphere'
    },
    lastObservation: {
        type: Date,
    },
    supportedObservationTypes: {
        type: SupportedObservationTypesSchema,
    }
});

DeviceSchema.statics.upsertDevice = function(device){
    return this.update({ name: device.name }, device, { upsert: true });
};

DeviceSchema.statics.findDeviceByName = function (name) {
    return this.findOne({ name: name });
};

DeviceSchema.statics.findDevices = function(longitude, latitude, maxDistance = constants.maxDefaultNearbyDistanceInMeters){
    let query;
    if (!_.isUndefined(longitude) && !_.isUndefined(latitude)) {
        query = {
            geometry: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            }
        };
    }
    return this.find(query);
};

const DeviceModel = mongoose.model('Device', DeviceSchema);

export { DeviceSchema, DeviceModel };