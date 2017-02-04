import _ from 'underscore';
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

MeasurementSchema.statics.getStats = function (type){
    const pipeline = [];
    if (!_.isUndefined(type)) {
        pipeline.push({
            "$match": {
                "type": type
            }
        });
    }
    pipeline.push({
        "$group": {
            "_id": "$type",
            "average": {
                "$avg": "$value"
            }
        }
    });
    return this.aggregate(pipeline)
};

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export default { MeasurementSchema, MeasurementModel };