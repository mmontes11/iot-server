import winston from 'winston';
import 'winston-mongodb';
import config from './env';

if (config.debug) {
    winston.add(winston.transports.MongoDB, { db : config.db, log: 'log' });
}

export default winston;
