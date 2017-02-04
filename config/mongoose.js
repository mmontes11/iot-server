import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import Promise from 'bluebird';
import mongoose from 'mongoose';

// Set default ES6 promises to mongoose
mongoose.Promise = Promise;

export default mongoose;
