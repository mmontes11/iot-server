export default {
    env: 'development',
    nodePort: 8000,
    mongoUrl: 'mongodb://localhost:27017/IoT',
    redisUrl: 'redis://localhost:6379',
    defaultCacheInSeconds: 10,
    statsCacheInSeconds: 5,
    basicAuthUsers: {
        admin: 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    debug: true
};