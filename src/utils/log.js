import winston from '../../lib/winston';
import config from '../../config/index';

function logInfo(message) {
    if (config.debug) {
        winston.info(message);
    }
}

function logError(message) {
    if (config.debug) {
        winston.error(message);
    }
}

export { logInfo, logError };

