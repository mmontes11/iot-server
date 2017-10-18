import requestIp from 'request-ip';
import geoIp from 'geoip-lite';
import publicIp from 'public-ip';
import _ from 'underscore';

const pointFromLatitudeLongitudeArray = (longitudeLatitudeArray) => {
    return {
        type: 'Point',
        coordinates: [
            longitudeLatitudeArray[1],
            longitudeLatitudeArray[0]
        ]
    }
};

const locationAndIpFromRequest = async (req) => {
    let ip = requestIp.getClientIp(req);
    try {
        let geoIpResult = await geoIp.lookup(ip);
        if (_.isNull(geoIpResult)) {
            // Assumption: The client is in the same network as the server
            ip = await publicIp.v4();
            geoIpResult = await geoIp.lookup(ip);
        }
        if (!_.isNull(geoIpResult)) {
            return {
                ip: ip,
                location: {
                    country: geoIpResult.country,
                    region: geoIpResult.region,
                    city: geoIpResult.city,
                    zipCode: geoIpResult.zipCode,
                    geometry: pointFromLatitudeLongitudeArray(geoIpResult.ll)
                }
            };
        } else {
            return undefined;
        }
    } catch (err) {
        throw err;
    }
};

export default { locationAndIpFromRequest };