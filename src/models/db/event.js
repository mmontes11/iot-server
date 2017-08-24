import mongoose from '../../../lib/mongoose';
import { ObservationSchema } from "./observation";

const EventSchema = ObservationSchema.extend({
    duration: {
        units: String,
        value: Number
    }
});
const EventModel = mongoose.model('Event', EventSchema);

export { EventSchema, EventModel };