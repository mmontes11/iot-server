import mongoose from "../lib/mongoose";
import { ObservationSchema } from "./observation";
import { buildMatch, buildDateHelpers } from "../helpers/aggregationHelper";

const EventSchema = ObservationSchema.extend({
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
});

EventSchema.statics.getStats = function getStats(type, timePeriod, things) {
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        type: 1,
        thing: 1,
        hour: { $hour: "$phenomenonTime" },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          hour: "$hour",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        thing: "$_id.thing",
        hour: "$_id.hour",
        count: "$count",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
        },
        total: {
          $sum: "$count",
        },
        avgByHour: {
          $avg: "$count",
        },
        maxByHour: {
          $max: "$count",
        },
        minByHour: {
          $min: "$count",
        },
        stdDevByHour: {
          $stdDevPop: "$count",
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        thing: "$_id.thing",
        total: "$total",
        avgByHour: "$avgByHour",
        maxByHour: "$maxByHour",
        minByHour: "$minByHour",
        stdDevByHour: "$stdDevByHour",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
        },
        data: {
          $push: {
            thing: "$thing",
            total: "$total",
            avgByHour: "$avgByHour",
            maxByHour: "$maxByHour",
            minByHour: "$minByHour",
            stdDevByHour: "$stdDevByHour",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        data: 1,
      },
    },
    {
      $sort: {
        type: 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};

EventSchema.statics.getData = function getData(groupBy, type, timePeriod, things) {
  const { dateToParts, dateFromParts } = buildDateHelpers(groupBy);
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        type: 1,
        thing: 1,
        date: dateToParts,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          date: "$date",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        type: "$_id.type",
        thing: "$_id.thing",
        phenomenonTime: dateFromParts,
        count: 1,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          phenomenonTime: "$phenomenonTime",
        },
        data: {
          $push: {
            thing: "$thing",
            count: "$count",
          },
        },
      },
    },
    {
      $sort: {
        "_id.phenomenonTime": 1,
      },
    },
    {
      $group: {
        _id: {
          type: "$_id.type",
        },
        events: {
          $push: {
            data: "$data",
            phenomenonTime: "$_id.phenomenonTime",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        events: 1,
      },
    },
    {
      $sort: {
        type: 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};

const EventModel = mongoose.model("Event", EventSchema);

export { EventSchema, EventModel };
