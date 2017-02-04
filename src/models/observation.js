import _ from 'underscore';
import mongoose from '../../config/mongoose';
import relatedEntity from './relatedEntity';

const ObservationSchema = new mongoose.Schema({
    creator: {
        userName: String,
        device: String
    },
    phenomenonTime: {
        type: Date,
        default: Date.now()
    },
    relatedEntities: [ relatedEntity.RelatedEntitySchema ],
    type: {
        type: String,
        required: true
    }
});

ObservationSchema.statics.last = function(type) {
    let query;
    if (_.isUndefined(type)){
        query = this.findOne()
    } else {
        query = this.findOne({ type : type })
    }
    return query.sort({ "phenomenonTime" : -1 })
};

const ObservationModel = mongoose.model('Observation', ObservationSchema);

export default { ObservationSchema, ObservationModel };