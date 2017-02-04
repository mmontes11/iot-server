export default {
    env: 'development',
    server_port: 8000,
    db: 'mongodb://localhost:27017/IoT',
    redis_host: 'localhost',
    redis_port: 6379,
    basicAuthUsers: {
        'admin': 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX'
};