const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    mongoUrl: mongoUrl,
    redisUrl: redisUrl,
    defaultCacheInSeconds: 10,
    statsCacheInSeconds: 30,
    basicAuthUsers: {
        'admin': 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    debug: true
};