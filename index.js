import mongoose from './config/mongoose';
import redis from './config/redis';
import app from './config/express';
import { Server } from 'http';
import SocketIO from 'socket.io';
import SocketController from './src/socket/socketController';
import config from './config/env';
import logger from './src/utils/logger';

const server = new Server(app);
const io = new SocketIO(server);
const socketController = new SocketController(io);
socketController.listen();

mongoose.connect(config.db, {useMongoClient: true}, err => {
	if (err) {
	    logger.logError(`Unable to connect to database ${config.db}`);
	    throw err;
	} else {
        logger.logInfo(`Connected to MongoDB ${config.db}`);
	}
});

redis.on("connect", () =>
    logger.logInfo(`Connected to Redis ${config.redis_host}:${config.redis_port}`)
);
redis.on("error", () =>
    logger.logError(`Error connecting to Redis ${config.redis_host}:${config.redis_port}`)
);

server.listen(config.port, err => {
    if (err) {
        logger.logError(`Error starting NodeJS server on port ${config.db}`);
        throw err;
    } else {
        logger.logInfo(`NodeJS server started on port ${config.port}`);
    }
});