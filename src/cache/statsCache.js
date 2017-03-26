import _ from 'underscore'
import cacheHandler from './cacheHandler'
import config from '../../config/env'
import { TimePeriod, CustomTimePeriod } from '../models/timePeriod'

const statsCacheKey = "stats";

function getStatsCacheKey(type, timePeriod) {
    var cacheKey = statsCacheKey;
    const elementsCacheKey = [];
    if (!_.isUndefined(type)) {
        elementsCacheKey.push(type)
    }
    if (!_.isUndefined(timePeriod) && !(timePeriod instanceof CustomTimePeriod) && !_.isUndefined(timePeriod.name)) {
        elementsCacheKey.push(timePeriod.name)
    }

    elementsCacheKey
        .map(filteredElement => {
            cacheKey = cacheKey.concat(`_${filteredElement}`)
        });

    return cacheKey
}

function setStatsCache(type, lastTimePeriod, stats) {
    cacheHandler.setObjectCache(getStatsCacheKey(type, lastTimePeriod), stats, config.statsCacheInSeconds)
}

function getStatsCache(type, lastTimePeriod) {
    return cacheHandler.getObjectCache(getStatsCacheKey(type, lastTimePeriod))
}

export default { setStatsCache, getStatsCache }