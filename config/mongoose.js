import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './env';

mongoose.Promise = Promise;

if (config.debug) {
    mongoose.set('debug', (collectionName, method, query, result) => {
        console.log(`MongoDB: ${collectionName}.${method}(${JSON.stringify(query)})`);
        console.log(`MongoDB: ${JSON.stringify(result)}`);
    });
}

export default mongoose;