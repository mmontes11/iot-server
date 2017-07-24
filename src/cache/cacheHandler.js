import redis from '../../config/redis'
import config from '../../config/env'

function setObjectCache(key, objectValue, expireTime) {
    if (config.debug) {
        console.log(`Redis: Setting '${key}' key`);
        console.log(`Redis: ${JSON.stringify(objectValue)}`);
    }
    redis.set(key, JSON.stringify(objectValue));
    redis.expire(key, expireTime)
}

async function getObjectCache(key) {
    try {
        const cachedRawObject = await redis.getAsync(key);
        if (config.debug) {
            console.log(`Redis: Getting key '${key}'`);
            console.log(`Redis: ${cachedRawObject}`);
        }
        return JSON.parse(cachedRawObject);
    } catch (err) {
        throw err;
    }
}

export default { setObjectCache, getObjectCache }