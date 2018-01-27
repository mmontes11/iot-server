import _ from 'underscore'
import cacheHandler from './cacheHandler'
import config from '../config/index'
import { CustomTimePeriod } from '../models/timePeriod'

const statsCacheKey = "stats";

const cachePolicy = (timePeriod) => {
    return _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod)
};

const getStatsCacheKey = (type, thing, lastTimePeriod) => {
    let cacheKey = statsCacheKey;
    const elementsCacheKey = [];
    if (!_.isUndefined(type)) {
        elementsCacheKey.push(type)
    }
    if (!_.isUndefined(thing)) {
        elementsCacheKey.push(thing);
    }
    if (!_.isUndefined(lastTimePeriod) && lastTimePeriod.isValid()) {
        elementsCacheKey.push(lastTimePeriod.name)
    }

    elementsCacheKey
        .map((keyPart) => {
            cacheKey = cacheKey.concat(`_${keyPart}`)
        });

    return cacheKey
};

const setStatsCache = (type, thing, lastTimePeriod, stats) => {
    cacheHandler.setObjectCache(getStatsCacheKey(type, thing, lastTimePeriod), stats, config.statsCacheInSeconds)
};

const getStatsCache = (type, thing, lastTimePeriod) => {
    return cacheHandler.getObjectCache(getStatsCacheKey(type, thing, lastTimePeriod))
};

export default { cachePolicy, setStatsCache, getStatsCache };