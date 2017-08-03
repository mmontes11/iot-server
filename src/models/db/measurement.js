import _ from "underscore";
import mongoose from "../../../lib/mongoose";
import observation from "./observation";


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

MeasurementSchema.statics.getStats = function (type, timePeriod){
    const pipeline = [];
    const matchConditions = [];
    if (!_.isUndefined(type)) {
        matchConditions.push({
            "type": type
        });
    }
    if (!_.isUndefined(timePeriod)) {
        if (!_.isUndefined(timePeriod.startDate)) {
            matchConditions.push({
                "phenomenonTime": {
                    "$gte": timePeriod.startDate.toDate()
                }
            });
        }
        if (!_.isUndefined(timePeriod.endDate)) {
            matchConditions.push({
                "phenomenonTime": {
                    "$lte": timePeriod.endDate.toDate()
                }
            });
        }
    }
    if (!_.isEmpty(matchConditions)) {
        pipeline.push({
            "$match": {
                "$and": matchConditions
            }
        })
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
            },
            "stdDev": {
                "$stdDevPop": "$value"
            }
        }
    });
    pipeline.push({
        "$project": {
            "_id": 0,
            "type": "$_id",
            "avg": 1,
            "max": 1,
            "min": 1,
            "stdDev": 1
        }
    });
    return this.aggregate(pipeline)
};

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export default { MeasurementSchema, MeasurementModel };