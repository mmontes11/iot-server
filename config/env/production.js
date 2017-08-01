const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    mongoUrl: mongoUrl,
    redisUrl: redisUrl,
    statsCacheInSeconds: 30,
    basicAuthUsers: {
        'YOUR_USER_HERE': 'YOUR_PASSWORD_HERE'
    },
    jwtSecret: 'YOUR_JWT_SECRET_HERE',
    debug: false
};