import mongoose from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

const MeasurementSchema = new mongoose.Schema({
    creator: {
        userName: String,
        device: String
    },
    creationTime: {
        type: Date,
        default: Date.now()
    },
    relatedEntities: [
        {
            name: String,
            type: String,
            geometry: GeoJSON
        }
    ],
    type: {
        type: String,
        required: true
    },
    units: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Measurement', MeasurementSchema)