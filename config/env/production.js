export default {
    env: 'production',
    db: 'mongodb://mongo_docker/js_backend',
    port: 8080,
    basicAuthUsers: {
        'admin': process.env.BASIC_AUTH_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET
};