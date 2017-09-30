import mongoose from '../../../lib/mongoose';
import { ObservationSchema } from "./observation";
import { UnitSchema } from './unit';


const EventSchema = ObservationSchema.extend({
    duration: {
        unit: {
            type: UnitSchema,
            required: false
        },
        value: {
            type: Number,
            required: false
        },
        required: false
    }
});
const EventModel = mongoose.model('Event', EventSchema);

export { EventSchema, EventModel };