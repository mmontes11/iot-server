import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import bluebird from 'bluebird';
import mongoose from 'mongoose';

// Set default ES6 promises to mongoose
mongoose.Promise = bluebird;

export default mongoose;
