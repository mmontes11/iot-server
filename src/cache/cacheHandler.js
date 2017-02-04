import Promise from 'bluebird'
import redis from '../../config/redis'

function setObjectCache(key, objectValue, expireTime) {
    redis.set(key, JSON.stringify(objectValue))
    redis.expire(key, expireTime)
}

function getObjectCache(key) {
    return new Promise ( (resolve, reject) => {
        redis.getAsync(key)
            .then( cachedStats => resolve(JSON.parse(cachedStats)))
            .catch( err => reject(err))
    })
}

export default { setObjectCache, getObjectCache }