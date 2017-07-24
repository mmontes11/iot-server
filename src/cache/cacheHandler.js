import redis from '../../config/redis'

function setObjectCache(key, objectValue, expireTime) {
    console.log(`Redis: Setting '${key}' key`);
    console.log(JSON.stringify(objectValue));
    redis.set(key, JSON.stringify(objectValue));
    redis.expire(key, expireTime)
}

async function getObjectCache(key) {
    try {
        console.log(`Redis: Getting key '${key}' `);
        const cachedRawObject = await redis.getAsync(key);
        console.log(cachedRawObject);
        return JSON.parse(cachedRawObject);
    } catch (err) {
        console.log(`Redis: Error getting key '${key}' key `);
        console.log(err);
        return undefined;
    }
}

export default { setObjectCache, getObjectCache }