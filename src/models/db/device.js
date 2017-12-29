import mongoose from '../../../lib/mongoose';
import constants from '../../utils/constants';
import _ from 'underscore';
import regex from '../../utils/regex';

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
        index: '2dsphere'
    },
    lastObservation: {
        type: Date,
        required: true
    }
});

DeviceSchema.statics.upsertDevice = function(device){
    return this.update({ name: device.name }, device, { upsert: true });
};

DeviceSchema.statics.findDeviceByName = function (name) {
    return this.findOne({ name: name });
};

DeviceSchema.statics.findDevices = function(longitude, latitude, maxDistance = constants.maxDefaultNearbyDistanceInMeters){
    const query = {};
    if (!_.isUndefined(longitude) && !_.isUndefined(latitude)) {
        query['location.geometry'] = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
            }
        };
    }
    return this.find(query);
};

const DeviceModel = mongoose.model('Device', DeviceSchema);

export { DeviceSchema, DeviceModel };