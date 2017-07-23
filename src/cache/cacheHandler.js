import redis from '../../config/redis'

function setObjectCache(key, objectValue, expireTime) {
    console.log(`Redis: Setting '${key}' key`);
    console.log(JSON.stringify(objectValue));
    redis.set(key, JSON.stringify(objectValue));
    redis.expire(key, expireTime)
}

async function getObjectCache(key) {
    const cachedRawObject = await redis.getAsync(key);
    if (cachedRawObject) {
        console.log(`Redis: Getting '${key}' key `);
        console.log(cachedRawObject);
        return JSON.parse(cachedRawObject);
    } else {
        return undefined;
    }
}

export default { setObjectCache, getObjectCache }