export default {
    env: 'development',
    port: 8000,
    db: 'mongodb://localhost:27017/IoT',
    redis: 'redis://localhost:6379',
    basicAuthUsers: {
        'admin': 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    statsCacheInSeconds: 30
};