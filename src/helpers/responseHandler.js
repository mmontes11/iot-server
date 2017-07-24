import _ from 'underscore';
import httpStatus from 'http-status';
import config from '../../config/env';

function handleResponse(res, response) {
    if (_.isEmpty(response) || _.isNull(response)) {
        res.sendStatus(httpStatus.NOT_FOUND)
    } else {
        res.json(response)
    }
}

function handleError(res, err) {
    if (config.debug) {
        console.log(`Error: ${err}`)
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
}

export default { handleResponse, handleError };