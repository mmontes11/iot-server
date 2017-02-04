import redis from 'redis';
import bluebird from 'bluebird';
import config from './env';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default redis.createClient(config.port, config.host);