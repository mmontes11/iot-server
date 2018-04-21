import _ from "underscore";
import httpStatus from "http-status";
import Promise from "bluebird";
import requestValidator from "../../helpers/requestValidator";
import modelFactory from "../../models/modelFactory";
import { ThingModel } from "../../models/thing";
import responseHandler from "../../helpers/responseHandler";
import constants from "../../utils/responseKeys";
import geocoder from "../../utils/geocoder";
import boolean from "../../utils/boolean";

const createOrUpdateThing = async (req, lastObservation) => {
  const thingToUpsert = modelFactory.createThing(req, lastObservation);
  await ThingModel.upsertThing(thingToUpsert);
  return thingToUpsert;
};

const getThingByName = async (req, res, next) => {
  const name = req.params.name;
  try {
    const thing = await ThingModel.findThingByName(name);
    responseHandler.handleResponse(res, thing);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getThings = async (req, res, next) => {
  try {
    const things = await _getThings(req);
    responseHandler.handleResponse(res, things, constants.thingsArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getThingNameFromRequest = async req => {
  if (!_.isUndefined(req.query.thing)) {
    return req.query.thing;
  }
  let things;
  try {
    things = await _getThings(req);
  } catch (err) {
    throw err;
  }
  const firstThing = _.first(things);
  return _.isUndefined(firstThing) ? undefined : firstThing.name;
};

const handleThingCreationError = async (req, res, createdObservations) => {
  if (!_.isUndefined(createdObservations) && !_.isEmpty(createdObservations)) {
    try {
      const removePromises = _.map(createdObservations, observation => observation.remove());
      await Promise.all(removePromises);
      _sendThingErrorResponse(req, res);
    } catch (err) {
      responseHandler.handleError(req, res);
    }
  } else {
    _sendThingErrorResponse(req, res);
  }
};

const _getThings = async req => {
  let longitude = req.query.longitude;
  let latitude = req.query.latitude;
  const address = req.query.address;
  const maxDistance = req.query.maxDistance;
  const supportsMeasurements = req.query.supportsMeasurements;
  const supportsMeasurementsBoolean = !_.isUndefined(supportsMeasurements)
    ? boolean.stringToBoolean(supportsMeasurements)
    : undefined;
  const supportsEvents = req.query.supportsEvents;
  const supportsEventsBoolean = !_.isUndefined(supportsEvents) ? boolean.stringToBoolean(supportsEvents) : undefined;

  if (!_.isUndefined(address)) {
    const location = await geocoder.geocode(address);
    if (!_.isUndefined(location)) {
      longitude = location.longitude;
      latitude = location.latitude;
    } else {
      return [];
    }
  }

  try {
    return await ThingModel.findThings(
      longitude,
      latitude,
      maxDistance,
      supportsMeasurementsBoolean,
      supportsEventsBoolean,
    );
  } catch (err) {
    throw err;
  }
};

const _sendThingErrorResponse = (req, res) => {
  const response = {
    [constants.invalidThingKey]: req.body.thing,
  };
  res.status(httpStatus.BAD_REQUEST).json(response);
};

export default {
  createOrUpdateThing,
  getThingByName,
  getThings,
  getThingNameFromRequest,
  handleThingCreationError,
};
