export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    mongoUrl: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    redisUrl: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    defaultCacheInSeconds: process.env.DEFAULT_CACHE_IN_SECONDS,
    statsCacheInSeconds: process.env.STATS_CACHE_IN_SECONDS,
    maxDefaultNearbyDistanceInMeters: process.env.MAX_DEFAULT_NEARBY_DISTANCE_IN_METERS,
    basicAuthUsers: {
        [`${process.env.BASIC_AUTH_USER}`]: `${process.env.BASIC_AUTH_PASSWORD}`
    },
    jwtSecret: `${process.env.JWT_SECRET}`,
    googleMapsKey: `${process.env.GOOGLE_MAPS_KEY}`,
    debug: process.env.IOT_DEBUG
};