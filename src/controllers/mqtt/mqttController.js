import mqtt from '../../lib/mqtt';
import Promise from 'bluebird';
import { logInfo, logError } from '../../utils/log';

const publishEvent = async (event) => {
    const topic = `${event.thing}/event/${event.type}`;
    await _publishJSON(topic, event);
};

const publishMeasurement = async (measurement) => {
    const topic = `${measurement.thing}/measurement/${measurement.type}`;
    await _publishJSON(topic, measurement);
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

export default { publishEvent, publishMeasurement };