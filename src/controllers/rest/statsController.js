import _ from "underscore";
import httpStatus from "http-status";
import responseHandler from "../../helpers/responseHandler";
import { CustomTimePeriod, TimePeriod } from "../../models/timePeriod";
import thingController from "./thingController";
import constants from "../../utils/responseKeys";

const getStats = async (req, res, StatsCache, getStatsFromDB) => {
  const {
    query: { type, startDate, endDate, timePeriod: timePeriodReq },
  } = req;
  let timePeriod;
  if (!_.isUndefined(startDate) || !_.isUndefined(endDate)) {
    timePeriod = new CustomTimePeriod(startDate, endDate);
  }
  if (!_.isUndefined(timePeriodReq)) {
    timePeriod = new TimePeriod(timePeriodReq);
  }
  try {
    let things;
    if (thingController.hasRequestedThings(req)) {
      things = await thingController.getThingsFromRequest(req);
      if (_.isUndefined(things)) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
    }
    const statsCache = new StatsCache(type, timePeriod, things);
    if (statsCache.cachePolicy()) {
      const statsFromCache = await statsCache.getStatsCache();
      if (!_.isNull(statsFromCache)) {
        return responseHandler.handleResponse(res, statsFromCache, constants.statsArrayKey);
      }
      const statsFromDB = await getStatsFromDB(type, timePeriod, things);
      statsCache.setStatsCache(statsFromDB);
      return responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
    }
    const statsFromDB = await getStatsFromDB(type, timePeriod, things);
    return responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default { getStats };
