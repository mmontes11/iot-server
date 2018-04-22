import _ from "underscore";
import { UserModel } from "./user";
import { MeasurementModel } from "./measurement";
import { EventModel } from "./event";
import ObservationKind from "./observationKind";
import { SubscriptionModel } from "./subscription";
import requestValidator from "../helpers/requestValidator";
import request from "../utils/request";
import ip from "../utils/ip";
import geojson from "../utils/geojson";

const createUser = user =>
  new UserModel({
    username: user.username,
    password: user.password,
  });

const createMeasurement = (req, { type, unit, value }) => {
  const {
    body: {
      thing: { name },
    },
  } = req;
  const username = request.extractUserNameFromRequest(req);
  return new MeasurementModel({
    username,
    thing: name,
    phenomenonTime: new Date(),
    type,
    unit,
    value,
  });
};

const createEvent = (req, { type, duration }) => {
  const {
    body: {
      thing: { name },
    },
  } = req;
  const username = request.extractUserNameFromRequest(req);
  return new EventModel({
    username,
    thing: name,
    phenomenonTime: new Date(),
    type,
    duration,
  });
};

const createObservationUsingKind = (req, observation) => {
  const { kind } = observation;
  if (_.isUndefined(kind)) {
    throw Error("observation.kind path is undefined");
  }
  const invalidObservationError = Error("Invalid observation");
  switch (kind) {
    case ObservationKind.measurementKind: {
      if (requestValidator.validMeasurement(observation)) {
        return createMeasurement(req, observation);
      }
      throw invalidObservationError;
    }
    case ObservationKind.eventKind: {
      if (requestValidator.validEvent(observation)) {
        return createEvent(req, observation);
      }
      throw invalidObservationError;
    }
    default: {
      throw Error(`Unsupported observation kind: ${kind}`);
    }
  }
};

const createThing = (req, lastObservation) => {
  const {
    body: { thing },
  } = req;
  try {
    const thingIp = ip.extractIPfromRequest(req);
    const { latitude, longitude } = geojson.latLangFromGeometry(thing.geometry);
    const thingExtraFields = {
      ip: thingIp,
      lastObservation,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    };
    return Object.assign({}, thing, thingExtraFields);
  } catch (err) {
    throw err;
  }
};

const createSubscription = subscription =>
  new SubscriptionModel({
    chatId: subscription.chatId,
    topic: subscription.topic,
  });

export default {
  createUser,
  createMeasurement,
  createEvent,
  createObservationUsingKind,
  createThing,
  createSubscription,
};
