import requestIp from 'request-ip';
import geoIp from 'geoip-lite';
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
    const ip = requestIp.getClientIp(req);
    try {
        const geoIpResult = await geoIp.lookup(ip);
        if (!_.isNull(geoIpResult)) {
            return {
                ip: ip,
                location: {
                    country: location.country,
                    region: location.region,
                    city: location.city,
                    zipCode: location.zipCode,
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