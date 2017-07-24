import jwt from 'jsonwebtoken';
import _ from 'underscore';
import httpStatus from 'http-status';

function extractUserNameFromRequest(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        return jwt.decode(token).userName;
    } else {
        return undefined;
    }
}

function handleResults(res, results) {
    if (_.isEmpty(results) || _.isNull(results)) {
        res.sendStatus(httpStatus.NOT_FOUND)
    } else {
        res.json(results)
    }
}

function handleError(res, err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
}

export default { extractUserNameFromRequest, handleResults, handleError };