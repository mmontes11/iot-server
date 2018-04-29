import _ from "underscore";
import mongoose from "../lib/mongoose";
import { ObservationSchema } from "./observation";
import { UnitSchema } from "./unit";

const MeasurementSchema = ObservationSchema.extend({
  unit: {
    type: UnitSchema,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

MeasurementSchema.statics.getStats = function getStats(type, things = [], timePeriod) {
  const match = [];
  const matchConditions = [];
  if (!_.isUndefined(type)) {
    matchConditions.push({
      type,
    });
  }
  if (!_.isEmpty(things)) {
    const thingsConditions = _.map(things, thing => ({ thing: { $eq: thing } }));
    matchConditions.push({
      $or: thingsConditions,
    });
  }
  if (!_.isUndefined(timePeriod)) {
    if (!_.isUndefined(timePeriod.startDate)) {
      matchConditions.push({
        phenomenonTime: {
          $gte: timePeriod.startDate.toDate(),
        },
      });
    }
    if (!_.isUndefined(timePeriod.endDate)) {
      matchConditions.push({
        phenomenonTime: {
          $lte: timePeriod.endDate.toDate(),
        },
      });
    }
  }
  if (!_.isEmpty(matchConditions)) {
    match.push({
      $match: {
        $and: matchConditions,
      },
    });
  }
  const pipeline = [
    {
      $project: {
        _id: 0,
        value: 1,
        type: 1,
        thing: 1,
        unitName: "$unit.name",
        unitSymbol: "$unit.symbol",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          unit: {
            name: "$unitName",
            symbol: "$unitSymbol",
          },
        },
        avg: {
          $avg: "$value",
        },
        max: {
          $max: "$value",
        },
        min: {
          $min: "$value",
        },
        stdDev: {
          $stdDevPop: "$value",
        },
      },
    },
    {
      $project: {
        _id: 0,
        data: "$_id",
        avg: 1,
        max: 1,
        min: 1,
        stdDev: 1,
      },
    },
    {
      $sort: {
        "data.type": 1,
        "data.thing": 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};
const MeasurementModel = mongoose.model("Measurement", MeasurementSchema);

export { MeasurementSchema, MeasurementModel };
