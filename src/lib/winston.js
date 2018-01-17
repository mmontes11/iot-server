import winston from 'winston';
import 'winston-mongodb';
import config from '../config';

const logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new winston.transports.Console ({
            timestamp: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
            timestamp: true,
            json: false,
            colorize: true,
            filename: 'log_iot.log'
        }),
        new winston.transports.MongoDB({
            timestamp: true,
            json: true,
            colorize: true,
            db: config.mongoUrl,
            collection: 'log_iot'
        })
    ]
});

export default logger;
