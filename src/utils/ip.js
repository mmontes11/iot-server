import requestIp from 'request-ip';
import _ from 'underscore';

const extractIPfromRequest = (req) => {
    let ip = requestIp.getClientIp(req);
    return stripIPV6prefix(ip);
};

const stripIPV6prefix = (ip) => {
    return ip.replace(/^.*:/, '')
};

export default { extractIPfromRequest };