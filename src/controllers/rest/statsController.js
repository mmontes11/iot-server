import _ from "underscore";
import httpStatus from "http-status";
import responseHandler from "../../helpers/responseHandler";
import { CustomTimePeriod, TimePeriod } from "../../models/timePeriod";
import thingController from "./thingController";

const _getTimePeriod = (startDate, endDate, timePeriod) => {
  if (!_.isUndefined(startDate) || !_.isUndefined(endDate)) {
    return new CustomTimePeriod(startDate, endDate);
  }
  if (!_.isUndefined(timePeriod)) {
    return new TimePeriod(timePeriod);
  }
  return undefined;
};

const getStats = async (req, res, StatsCache, getStatsFromDB, getThings) => {
  const {
    query: { type, startDate, endDate, timePeriod: timePeriodReq },
  } = req;
  const timePeriod = _getTimePeriod(startDate, endDate, timePeriodReq);
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
        return responseHandler.handleResponse(res, statsFromCache);
      }
      const statsFromDB = await getStatsFromDB(type, timePeriod, things);
      if (_.isEmpty(statsFromDB)) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      if (_.isUndefined(things)) {
        things = await getThings(type, timePeriod);
      }
      if (_.isEmpty(things)) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      const statsToCache = {
        stats: statsFromDB,
        things,
      };
      statsCache.setStatsCache(statsToCache);
      return responseHandler.handleResponse(res, statsToCache);
    }
    if (_.isUndefined(things)) {
      things = await getThings(type, timePeriod);
    }
    if (_.isEmpty(things)) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const statsFromDB = await getStatsFromDB(type, timePeriod, things);
    if (_.isEmpty(statsFromDB)) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const statsRes = {
      stats: statsFromDB,
      things,
    };
    return responseHandler.handleResponse(res, statsRes);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default { getStats };
