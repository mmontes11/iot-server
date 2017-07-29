import winston from '../../config/winston';
import config from '../../config/env';

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

export default { logInfo, logError };

