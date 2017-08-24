import mongoose from '../../../lib/mongoose';

const RelatedEntitySchema = new mongoose.Schema({
    name: String,
    type: String,
    geometry: mongoose.Schema.Types.GeoJSON
});
const RelatedEntity = mongoose.model('RelatedEntity', RelatedEntitySchema);

export { RelatedEntitySchema, RelatedEntity };