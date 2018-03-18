import mqtt from 'async-mqtt';
import config from '../config/index'

const mqttClient = mqtt.connect(config.mqttBrokerUrl);

export default mqttClient;