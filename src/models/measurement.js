import mongoose from '../../config/mongoose';
import observation from './observation';

const MeasurementSchema = observation.ObservationSchema.extend({
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