import Promise from 'bluebird'
import redis from '../../config/redis'

function setObjectCache(key, objectValue, expireTime) {
    console.log(`Redis: Setting '${key}' key`);
    console.log(JSON.stringify(objectValue));
    redis.set(key, JSON.stringify(objectValue));
    redis.expire(key, expireTime)
}

function getObjectCache(key) {
    return new Promise ( (resolve, reject) => {
        redis.getAsync(key)
            .then( cachedStats => {
                console.log(`Redis: Getting '${key}' key `);
                console.log(cachedStats);
                return resolve(JSON.parse(cachedStats));
            })
            .catch( err => reject(err))
    })
}

export default { setObjectCache, getObjectCache }