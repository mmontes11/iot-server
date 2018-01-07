import googleMaps from '../lib/googleMaps';
import _ from 'underscore';
import { logInfo, logError } from './log';

const geocode = async (address) => {
    return new Promise((resolve, reject) => {
        logInfo(`Geocoding address '${address}'...`);

        googleMaps.geocode({
            address: address
        }, (err, response) => {
            logInfo(`Geocoding response:`);
            logInfo(JSON.stringify(response));
            const httpStatus = response.status;

            if (!_.isNull(err) || httpStatus >= 400) {
                logError(`Geocoding error: HTTP ${httpStatus} status`);
                logError(err);
                reject(err);
            } else {
                const firstResult = _.first(response.json.results);
                if (!_.isUndefined(firstResult)) {
                    logInfo('Geocoding success');
                    const location = firstResult.geometry.location;
                    resolve({
                        longitude: location.lng,
                        latitude: location.lat
                    });
                } else {
                    logInfo(`Geocoding: No results`);
                    resolve(undefined);
                }
            }
        });
    });
};

export default { geocode };