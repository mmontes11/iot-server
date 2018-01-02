import googleMaps from '@google/maps';
import config from '../config/index';

const googleMapsClient = googleMaps.createClient({ key: config.googleMapsKey});

export default googleMapsClient;