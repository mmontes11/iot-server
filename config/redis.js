import redis from 'redis';
import Promise from 'bluebird';
import config from './env';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redis);

redisClient.on("error", err => {
    console.log(`Redis error: ${err}`)
});

export default redisClient;