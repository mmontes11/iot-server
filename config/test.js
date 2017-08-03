export default {
    env: 'test',
    nodePort: 8000,
    mongoUrl: 'mongodb://localhost:27017/IoT_test',
    redisUrl: 'redis://localhost:6379',
    statsCacheInSeconds: 5,
    basicAuthUsers: {
        'admin': 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    debug: true
};