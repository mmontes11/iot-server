export default {
    env: 'production',
    server_port: 8080,
    db: 'mongodb://mongo_docker:27017/IoT',
    redis_host: 'localhost',
    redis_port: 6379,
    basicAuthUsers: {
        'admin': process.env.BASIC_AUTH_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET
};