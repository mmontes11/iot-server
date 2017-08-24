import _ from "underscore";
import mongoose from "../../../lib/mongoose";
import { ObservationSchema } from "./observation";

const MeasurementSchema = ObservationSchema.extend({
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
    const match = [];
    const matchConditions = [];
    if (!_.isUndefined(type)) {
        matchConditions.push({
            type
        });
    }
    if (!_.isUndefined(timePeriod)) {
        if (!_.isUndefined(timePeriod.startDate)) {
            matchConditions.push({
                phenomenonTime: {
                    $gte: timePeriod.startDate.toDate()
                }
            });
        }
        if (!_.isUndefined(timePeriod.endDate)) {
            matchConditions.push({
                phenomenonTime: {
                    $lte: timePeriod.endDate.toDate()
                }
            });
        }
    }
    if (!_.isEmpty(matchConditions)) {
        match.push({
            $match: {
                $and: matchConditions
            }
        })
    }
    const pipeline = [
        {
            $group: {
                _id: '$type',
                avg: {
                    $avg: '$value'
                },
                max: {
                    $max: '$value'
                },
                min: {
                    $min: '$value'
                },
                stdDev: {
                    $stdDevPop: '$value'
                },
            }
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                avg: 1,
                max: 1,
                min: 1,
                stdDev: 1

            }
        }
    ];
    return this.aggregate([...match, ...pipeline]);
};

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export { MeasurementSchema, MeasurementModel };