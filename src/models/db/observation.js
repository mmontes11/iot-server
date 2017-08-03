import _ from 'underscore';
import mongoose from '../../../lib/mongoose';
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

ObservationSchema.statics.types = function() {
    return this.distinct("type")
};

ObservationSchema.statics.last = function(type) {
    let findCriteria = undefined;
    if (!_.isUndefined(type)) {
        findCriteria = { type : type };
    }
    const sortCriteria = { "phenomenonTime" : -1 };
    return this.find(findCriteria).sort(sortCriteria).limit(1)
};

const ObservationModel = mongoose.model('Observation', ObservationSchema);

export default { ObservationSchema, ObservationModel };