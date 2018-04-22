import _ from "underscore";
import cacheHandler from "./cacheHandler";
import config from "../config/index";
import { CustomTimePeriod } from "../models/timePeriod";

const statsCacheKey = "stats";

const cachePolicy = timePeriod => _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod);

const _getStatsCacheKey = (type, thing, timePeriod) => {
  const elementsCacheKey = [];
  if (!_.isUndefined(type)) {
    elementsCacheKey.push(type);
  }
  if (!_.isUndefined(thing)) {
    elementsCacheKey.push(thing);
  }
  if (!_.isUndefined(timePeriod) && timePeriod.isValid()) {
    elementsCacheKey.push(timePeriod.name);
  }
  return _.reduce(elementsCacheKey, (memo, keyPart) => memo.concat(`_${keyPart}`), statsCacheKey);
};

const setStatsCache = (type, thing, timePeriod, stats) => {
  cacheHandler.setObjectCache(_getStatsCacheKey(type, thing, timePeriod), stats, config.statsCacheInSeconds);
};

const getStatsCache = (type, thing, timePeriod) =>
  cacheHandler.getObjectCache(_getStatsCacheKey(type, thing, timePeriod));

export default { cachePolicy, setStatsCache, getStatsCache };
