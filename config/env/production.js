export default {
    env: 'production',
    port: 8080,
    db: 'mongodb://mongo_docker:27017/IoT',
    redis_port: '6379',
    redis_host: 'redis_docker',
    basicAuthUsers: {
        'admin': 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    statsCacheInSeconds: 30
};