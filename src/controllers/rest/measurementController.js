import _ from "underscore";
import httpStatus from "http-status";
import { MeasurementModel } from "../../models/measurement";
import modelFactory from "../../helpers/modelFactory";
import { TimePeriod, CustomTimePeriod } from "../../models/timePeriod";
import statsCache from "../../cache/statsCache";
import responseHandler from "../../helpers/responseHandler";
import thingController from "./thingController";
import mqttController from "../mqtt/mqttController";
import constants from "../../utils/responseKeys";

const createMeasurement = async (req, res) => {
  let newMeasurement;
  try {
    const measurement = modelFactory.createMeasurement(req, req.body.measurement);
    newMeasurement = await measurement.save();
  } catch (err) {
    responseHandler.handleError(res, err);
  }
  let thing;
  try {
    thing = await thingController.createOrUpdateThing(req, newMeasurement.phenomenonTime);
  } catch (err) {
    await thingController.handleThingCreationError(req, res, [newMeasurement]);
  }
  await mqttController.publishMeasurement(thing, newMeasurement);
  res.status(httpStatus.CREATED).json(newMeasurement);
};

const getTypes = async (req, res) => {
  try {
    const types = await MeasurementModel.types();
    responseHandler.handleResponse(res, types, constants.typesArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getLastMeasurement = async ({ query: { type, thing } }, res) => {
  try {
    const lastMeasurements = await MeasurementModel.findLastN(1, type, thing);
    responseHandler.handleResponse(res, _.first(lastMeasurements));
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const _getStatsFromDB = async (type, things, timePeriod) => {
  try {
    return await MeasurementModel.getStats(type, things, timePeriod);
  } catch (err) {
    throw err;
  }
};

const getStats = async (req, res) => {
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
    if (statsCache.cachePolicy(timePeriod)) {
      const statsFromCache = await statsCache.getMeasurementStatsCache(type, things, timePeriod);
      if (!_.isNull(statsFromCache)) {
        return responseHandler.handleResponse(res, statsFromCache, constants.statsArrayKey);
      }
      const statsFromDB = await _getStatsFromDB(type, things, timePeriod);
      statsCache.setMeasurementStatsCache(type, things, timePeriod, statsFromDB);
      return responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
    }
    const statsFromDB = await _getStatsFromDB(type, things, timePeriod);
    return responseHandler.handleResponse(res, statsFromDB, constants.statsArrayKey);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default {
  createMeasurement,
  getTypes,
  getLastMeasurement,
  getStats,
};
