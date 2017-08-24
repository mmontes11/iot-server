import redis from '../../lib/redis'
import logger from '../utils/logger';
import config from '../../config'

function setObjectCache(key, objectValue, expireTimeInSeconds = config.defaultCacheInSeconds) {
    const objectString = JSON.stringify(objectValue);
    logger.logInfo(`Redis set key '${key}': ${objectString}`);
    redis.set(key, objectString);
    logger.logInfo(`Redis expire '${key}': ${expireTimeInSeconds}`);
    redis.expire(key, expireTimeInSeconds)
}

async function getObjectCache(key) {
    try {
        const cachedRawObject = await redis.getAsync(key);
        logger.logInfo(`Redis get '${key}': ${cachedRawObject}`);
        return JSON.parse(cachedRawObject);
    } catch (err) {
        throw err;
    }
}

export default { setObjectCache, getObjectCache }