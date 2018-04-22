import _ from "underscore";
import googleMaps from "../lib/googleMaps";
import { logInfo, logError } from "./log";

const geocode = async address =>
  new Promise((resolve, reject) => {
    logInfo(`Geocoding address '${address}'...`);
    googleMaps.geocode(
      {
        address,
      },
      (err, response) => {
        logInfo("Geocoding response:");
        logInfo(JSON.stringify(response));
        const httpStatus = response.status;

        if (!_.isNull(err) || httpStatus >= 400) {
          logError(`Geocoding error: HTTP ${httpStatus} status`);
          logError(err);
          reject(err);
        } else {
          const firstResult = _.first(response.json.results);
          if (!_.isUndefined(firstResult)) {
            logInfo("Geocoding success");
            const { lng: longitude, lat: latitude } = firstResult.geometry.location;
            resolve({
              longitude,
              latitude,
            });
          } else {
            logInfo("Geocoding: No results");
            resolve(undefined);
          }
        }
      },
    );
  });

export default { geocode };
