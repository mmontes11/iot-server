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
            "avg": {
                "$avg": "$value"
            },
            "max": {
                "$max": "$value"
            },
            "min": {
                "$min": "$value"
            }
        }
    });
    pipeline.push({
        "$project": {
            "_id": 0,
            "type": "$_id",
            "avg": 1,
            "max": 1,
            "min": 1
        }
    });
    return this.aggregate(pipeline)
};

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export default { MeasurementSchema, MeasurementModel };