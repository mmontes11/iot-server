import _ from 'underscore'
import cacheHandler from './cacheHandler'
import config from '../../config/index'
import { CustomTimePeriod } from '../models/request/timePeriod'

const statsCacheKey = "stats";

const cachePolicy = (timePeriod) => {
    return _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod)
};

const getStatsCacheKey = (type, lastTimePeriod) => {
    let cacheKey = statsCacheKey;
    const elementsCacheKey = [];
    if (!_.isUndefined(type)) {
        elementsCacheKey.push(type)
    }
    if (!_.isUndefined(lastTimePeriod) && lastTimePeriod.isValid()) {
        elementsCacheKey.push(lastTimePeriod.name)
    }

    elementsCacheKey
        .map((filteredElement) => {
            cacheKey = cacheKey.concat(`_${filteredElement}`)
        });

    return cacheKey
};

const setStatsCache = (type, lastTimePeriod, stats) => {
    cacheHandler.setObjectCache(getStatsCacheKey(type, lastTimePeriod), stats, config.statsCacheInSeconds)
};

const getStatsCache = (type, lastTimePeriod) => {
    return cacheHandler.getObjectCache(getStatsCacheKey(type, lastTimePeriod))
};

export default { cachePolicy, setStatsCache, getStatsCache };