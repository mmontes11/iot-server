import winston from 'winston';
import 'winston-mongodb';
import config from './env';

winston.remove(winston.transports.Console);

if (config.debug) {
    winston.add(winston.transports.Console, {
        timestamp: true,
        json: false,
        colorize: true
    });
    winston.add(winston.transports.File, {
        timestamp: true,
        json: false,
        colorize: true,
        filename: 'log_iot.log'
    });
    winston.add(winston.transports.MongoDB, {
        timestamp: true,
        json: true,
        colorize: true,
        db: config.db,
        collection: 'log_iot'
    });
}

export default winston;
