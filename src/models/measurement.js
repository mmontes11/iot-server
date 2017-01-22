import mongoose from '../../config/mongoose';
import relatedEntity from './relatedEntity';

const MeasurementSchema = new mongoose.Schema({
    creator: {
        userName: String,
        device: String
    },
    measurementTime: {
        type: Date,
        default: Date.now()
    },
    relatedEntities: [ relatedEntity.RelatedEntitySchema ],
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
const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export default { MeasurementSchema, MeasurementModel };