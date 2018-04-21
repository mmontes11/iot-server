import mqtt from "../../lib/mqtt";
import Promise from "bluebird";
import _ from "underscore";
import { logInfo, logError } from "../../utils/log";
import { MeasurementModel } from "../../models/measurement";
import { EventModel } from "../../models/event";

const publishEvent = async (thing, event) => {
  const topic = `${thing.topic}/event/${event.type}`;
  await _publishJSON(topic, event);
};

const publishMeasurement = async (thing, measurement) => {
  const topic = `${thing.topic}/measurement/${measurement.type}`;
  await _publishJSON(topic, measurement);
};

const publishObservations = async (thing, observations) => {
  const promises = _.map(observations, observation => {
    if (observation instanceof EventModel) {
      return publishEvent(thing, observation);
    } else if (observation instanceof MeasurementModel) {
      return publishMeasurement(thing, observation);
    }
  });
  await Promise.all(promises);
};

const _publishJSON = async (topic, json) => {
  const data = JSON.stringify(json);
  try {
    await mqtt.publish(topic, data);
    logInfo(`Published in topic ${topic}:`);
    logInfo(data);
  } catch (err) {
    logError(`Error publishing in topic ${topic}:`);
    logError(data);
    logError(err);
  }
};

export default { publishEvent, publishMeasurement, publishObservations };
