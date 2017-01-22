import mongoose from '../../config/mongoose';
import relatedEntity from './relatedEntity';

const ObservationSchema = new mongoose.Schema({
    creator: {
        userName: String,
        device: String
    },
    phenomenonTime: {
        type: Date,
        default: Date.now()
    },
    relatedEntities: [ relatedEntity.RelatedEntitySchema ],
    type: {
        type: String,
        required: true
    }
});
const ObservationModel = mongoose.model('Observation', ObservationSchema);

export default { ObservationSchema, ObservationModel };