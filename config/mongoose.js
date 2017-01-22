import 'mongoose-geojson-schema';
import 'mongoose-schema-extend';
import mongoose from 'mongoose';

// Set default ES6 promises to mongoose
mongoose.Promise = Promise;

export default mongoose;
