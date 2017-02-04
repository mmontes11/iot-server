import _ from 'underscore'
import cacheHandler from './cacheHandler'
import config from '../../config/env'

const statsCacheKey = "stats";

function getStatsCacheKey(type) {
    if (_.isUndefined(type)) {
        return statsCacheKey
    } else {
        return `${statsCacheKey}_${type}`
    }
}

function setStatsCache(type,stats) {
    cacheHandler.setObjectCache(getStatsCacheKey(type), stats, config.statsCacheInSeconds)
}

function getStatsCache(type) {
    return cacheHandler.getObjectCache(getStatsCacheKey(type))
}

export default { setStatsCache, getStatsCache }