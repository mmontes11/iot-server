import _ from "underscore";

const buildMatch = (type, timePeriod, things) => {
  const match = [];
  const matchConditions = [];
  if (!_.isUndefined(type)) {
    matchConditions.push({
      type,
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
  if (!_.isUndefined(things) && !_.isEmpty(things)) {
    const thingsConditions = _.map(things, thing => ({ thing: { $eq: thing } }));
    matchConditions.push({
      $or: thingsConditions,
    });
  }
  if (!_.isEmpty(matchConditions)) {
    match.push({
      $match: {
        $and: matchConditions,
      },
    });
  }
  return match;
};

export default { buildMatch };
