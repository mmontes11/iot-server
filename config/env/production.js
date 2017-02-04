export default {
    env: 'production',
    port: 8080,
    db: 'mongodb://mongo_docker:27017/IoT',
    redis: 'redis://localhost:6379',
    basicAuthUsers: {
        'admin': process.env.BASIC_AUTH_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET,
    statsCacheInSeconds: 30
};