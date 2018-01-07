import mongoose from './lib/mongoose';
import redis from './lib/redis';
import app from './lib/express';
import { Server } from 'http';
import config from './config/index';
import { logInfo, logError } from './utils/log';

const server = new Server(app);

mongoose.connect(config.mongoUrl, {useMongoClient: true}, (err) => {
	if (err) {
	    logError(`Unable to connect to database ${config.mongoUrl}`);
	    throw err;
	} else {
        logInfo(`Connected to MongoDB ${config.mongoUrl}`);
	}
});

redis.on("connect", () => {
    logInfo(`Connected to Redis ${config.redisUrl}`)
});
redis.on("error", () => {
    logError(`Error connecting to Redis ${config.redisUrl}`)
});

server.listen(config.nodePort, (err) => {
    if (err) {
        logError(`Error starting NodeJS server on port ${config.nodePort}`);
        throw err;
    } else {
        logInfo(`NodeJS server started on port ${config.nodePort}`);
    }
});
server.on('close', (err) => {
    if (err) {
        logError(`Error stopping NodeJS server on port ${config.nodePort}`);
        throw err;
    } else {
        logInfo(`Stopped NodeJS server on port ${config.nodePort}`);
    }
});

process.on('SIGINT', function() {
    server.close();
});

export default server;