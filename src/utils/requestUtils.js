import jwt from 'jsonwebtoken';

function extractUserNameFromRequest(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        return jwt.decode(token).username;
    } else {
        return undefined;
    }
}

export { extractUserNameFromRequest };