import winston from 'winston';
import 'winston-mongodb';
import config from './env';

if (config.debug) {
    winston.add(winston.transports.File, {
        json: false,
        colorize: true,
        filename: 'log_iot.log'
    });
    winston.add(winston.transports.MongoDB, {
        json: true,
        colorize: true,
        db: config.db,
        collection: 'log_iot'
    });
}

export default winston;
