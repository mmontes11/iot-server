import _ from 'underscore'
import cacheHandler from './cacheHandler'
import config from '../../config/index'
import { CustomTimePeriod } from '../models/request/timePeriod'

const statsCacheKey = "stats";

const cachePolicy = (timePeriod) => {
    return _.isUndefined(timePeriod) || !(timePeriod instanceof CustomTimePeriod)
};

const getStatsCacheKey = (type, device, lastTimePeriod) => {
    let cacheKey = statsCacheKey;
    const elementsCacheKey = [];
    if (!_.isUndefined(type)) {
        elementsCacheKey.push(type)
    }
    if (!_.isUndefined(device)) {
        elementsCacheKey.push(device);
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

const setStatsCache = (type, device, lastTimePeriod, stats) => {
    cacheHandler.setObjectCache(getStatsCacheKey(type, device, lastTimePeriod), stats, config.statsCacheInSeconds)
};

const getStatsCache = (type, device, lastTimePeriod) => {
    return cacheHandler.getObjectCache(getStatsCacheKey(type, device, lastTimePeriod))
};

export default { cachePolicy, setStatsCache, getStatsCache };