import redis from 'redis';
import bluebird from 'bluebird';
import config from './env';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redis);

redisClient.on("error", err => {
    console.log(`Redis error: ${err}`)
});

export default redisClient;