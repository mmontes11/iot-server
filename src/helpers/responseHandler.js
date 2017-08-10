import _ from 'underscore';
import httpStatus from 'http-status';
import logger from '../utils/logger';

function handleResponse(res, response, arrayName = "result") {
    if (_.isEmpty(response) || _.isNull(response) || _.isUndefined(response)) {
        res.sendStatus(httpStatus.NOT_FOUND)
    } else if (_.isArray(response)) {
        const responseObject = {
            [arrayName]: response
        };
        res.json(responseObject);
    } else {
        res.json(response)
    }
}

function handleError(res, err) {
    logger.logError(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
}

export default { handleResponse, handleError };