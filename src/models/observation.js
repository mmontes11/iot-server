import _ from "underscore";
import mongoose from "../lib/mongoose";

const ObservationSchema = new mongoose.Schema({
  username: String,
  thing: {
    type: String,
    required: true,
  },
  phenomenonTime: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: String,
    required: true,
  },
});

ObservationSchema.statics.types = function types() {
  return this.distinct("type");
};

ObservationSchema.statics.findLastN = function findLastN(n = 10, type) {
  let findCriteria;
  if (!_.isUndefined(type)) {
    findCriteria = { type };
  }
  return this.find(findCriteria)
    .sort({ phenomenonTime: -1 })
    .limit(n);
};

const ObservationModel = mongoose.model("Observation", ObservationSchema);

export { ObservationSchema, ObservationModel };
