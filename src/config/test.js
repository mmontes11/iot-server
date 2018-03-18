export default {
    env: 'test',
    nodePort: 9000,
    mongoUrl: 'mongodb://localhost:27017/IoT-test',
    redisUrl: 'redis://localhost:6379',
    mqttBrokerUrl : 'mqtt://localhost:1883',
    defaultCacheInSeconds: 10,
    statsCacheInSeconds: 1,
    maxDefaultNearbyDistanceInMeters: 10000,
    basicAuthUsers: {
        admin: 'admin'
    },
    jwtSecret: '2SrZAfNgGhn7eff2P5hvPUdX',
    googleMapsKey: 'AIzaSyCtlsvLkEPTwMmSPXm1EsBXcdJ94kZNJC4',
    debug: true
};