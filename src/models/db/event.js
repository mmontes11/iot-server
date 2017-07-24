import mongoose from '../../../config/mongoose';
import observation from './observation';

const EventSchema = observation.ObservationSchema.extend({
    duration: {
        units: String,
        value: Number
    }
});
const EventModel = mongoose.model('Event', EventSchema);

export default  { EventSchema, EventModel };