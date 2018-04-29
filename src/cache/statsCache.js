import _ from "underscore";
import cacheHandler from "./cacheHandler";
import config from "../config/index";
import { CustomTimePeriod } from "../models/timePeriod";

const statsPrefix = "stats";
const measurementStatsPrefix = `measurement_${statsPrefix}`;

const cachePolicy = timePeriod => _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod);

const _getStatsCacheKey = (prefix, type, things, timePeriod) => {
  const elementsCacheKey = [];
  if (!_.isUndefined(type)) {
    elementsCacheKey.push(type);
  }
  if (!_.isUndefined(timePeriod) && timePeriod.isValid()) {
    elementsCacheKey.push(timePeriod.name);
  }
  if (!_.isUndefined(things) && !_.isEmpty(things)) {
    elementsCacheKey.push(...things);
  }
  return _.reduce(elementsCacheKey, (memo, keyPart) => memo.concat(`_${keyPart}`), prefix);
};

const setMeasurementStatsCache = (type, things, timePeriod, stats) =>
  cacheHandler.setObjectCache(
    _getStatsCacheKey(measurementStatsPrefix, type, things, timePeriod),
    stats,
    config.statsCacheInSeconds,
  );

const getMeasurementStatsCache = (type, things, timePeriod) =>
  cacheHandler.getObjectCache(_getStatsCacheKey(measurementStatsPrefix, type, things, timePeriod));

export default { cachePolicy, setMeasurementStatsCache, getMeasurementStatsCache };
