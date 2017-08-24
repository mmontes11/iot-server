import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from '../config/index';
import { logInfo } from '../src/utils/log';

mongoose.Promise = Promise;

if (config.debug) {
    mongoose.set('debug', (collectionName, method, query, result) => {
        logInfo(`MongoDB query: ${collectionName}.${method}(${JSON.stringify(query)})`);
        logInfo(`MongoDB result: ${JSON.stringify(result)}`);
    });
}

export default mongoose;