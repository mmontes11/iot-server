import mongoose from '../../../lib/mongoose';

const DeviceLocationSchema = new mongoose.Schema({
    country: String,
    region: String,
    city: String,
    zipCode: String,
    geometry: {
        type: mongoose.Schema.Types.GeoJSON,
        index: '2dsphere'
    }
});

const DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    ip: {
        type: String,
        required: false
    },
    location: {
        type: DeviceLocationSchema,
        required: false
    },
    lastObservation: {
        type: Date,
        required: true
    }
});

DeviceSchema.statics.upsertDevice = function(device){
    return this.update({ name: device.name }, device, { upsert: true });
};

const DeviceModel = mongoose.model('Device', DeviceSchema);

export { DeviceSchema, DeviceModel };