export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    mongoUrl: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    redisUrl: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    defaultCacheInSeconds: 10,
    statsCacheInSeconds: 30,
    maxDefaultNearbyDistanceInMeters: 10000,
    debug: true
};