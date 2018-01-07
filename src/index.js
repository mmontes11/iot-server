import mongoose from './lib/mongoose';
import redis from './lib/redis';
import _ from 'underscore'
import app from './lib/express';
import { Server } from 'http';
import config from './config/index';
import { logInfo, logError } from './utils/log';

const server = new Server(app);

mongoose.connection.on('connected', () => {
    logInfo(`Connected to MongoDB ${config.mongoUrl}`);
});
mongoose.connection.on('error', (err) => {
    logError(`Error in MongoDB ${config.mongoUrl}:`);
    logError(err);
});
mongoose.connection.on('disconnected', () => {
    logInfo(`Disconnected from MongoDB ${config.mongoUrl}`);
});

redis.on('connect', () => {
    logInfo(`Connected to Redis ${config.redisUrl}`);
});
redis.on('error', (err) => {
    logError(`Error in Redis ${config.redisUrl}:`);
    logError(err);
});
redis.on('end', () => {
    logInfo(`Disconnected from Redis ${config.redisUrl}`);
});

server.on('error', (err) => {
    logError(`Error in NodeJS server on port ${config.nodePort}:`);
    logError(err);
});
server.on('close', () => {
    logInfo(`Stopped NodeJS server on port ${config.nodePort}`);
});

process.on('SIGINT', () => {
    redis.quit();
    mongoose.connection.close();
    server.close();
});

server.listen(config.nodePort, (err) => {
    if (_.isUndefined(err) || _.isNull(err)) {
        logInfo(`NodeJS server started on port ${config.nodePort}`);
    }
});

export default server;