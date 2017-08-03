import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from '../config/index';
import logger from '../src/utils/logger';

mongoose.Promise = Promise;

if (config.debug) {
    mongoose.set('debug', (collectionName, method, query, result) => {
        logger.logInfo(`MongoDB query: ${collectionName}.${method}(${JSON.stringify(query)})`);
        logger.logInfo(`MongoDB result: ${JSON.stringify(result)}`);
    });
}

export default mongoose;