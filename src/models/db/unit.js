import mongoose from '../../lib/mongoose';

const UnitSchema = new mongoose.Schema({
    name: String,
    symbol: String,
});
const Unit = mongoose.model('Unit', UnitSchema);

export { UnitSchema, Unit };