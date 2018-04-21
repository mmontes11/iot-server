import _ from "underscore";
import cacheHandler from "./cacheHandler";
import config from "../config/index";
import { CustomTimePeriod } from "../models/timePeriod";

const statsCacheKey = "stats";

const cachePolicy = timePeriod => _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod);

const getStatsCacheKey = (type, thing, timePeriod) => {
  let cacheKey = statsCacheKey;
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

  elementsCacheKey.map(keyPart => {
    cacheKey = cacheKey.concat(`_${keyPart}`);
  });

  return cacheKey;
};

const setStatsCache = (type, thing, timePeriod, stats) => {
  cacheHandler.setObjectCache(getStatsCacheKey(type, thing, timePeriod), stats, config.statsCacheInSeconds);
};

const getStatsCache = (type, thing, timePeriod) =>
  cacheHandler.getObjectCache(getStatsCacheKey(type, thing, timePeriod));

export default { cachePolicy, setStatsCache, getStatsCache };
