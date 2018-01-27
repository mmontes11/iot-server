import mongoose from '../lib/mongoose';
import config from '../config/index';
import _ from 'underscore';
import regex from '../utils/regex';

const SupportedObservationTypesSchema = mongoose.Schema({
    measurement: [{
        type: String
    }],
    event: [{
        type: String
    }]
});

const ThingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    ip: {
        type: String,
        required: true,
        match: regex.ipRegex
    },
    geometry: {
        type: mongoose.Schema.Types.GeoJSON,
        required: true,
        index: '2dsphere'
    },
    lastObservation: {
        type: Date,
    },
    supportedObservationTypes: {
        type: SupportedObservationTypesSchema,
        required: true
    }
});

ThingSchema.statics.upsertThing = function(thing){
    return this.update({ name: thing.name }, thing, { upsert: true });
};

ThingSchema.statics.findThingByName = function (name) {
    return this.findOne({ name: name });
};

ThingSchema.statics.findThings = function(longitude, latitude, maxDistance = config.maxDefaultNearbyDistanceInMeters){
    let query;
    if (!_.isUndefined(longitude) && !_.isUndefined(latitude)) {
        query = {
            geometry: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            }
        };
    }
    return this.find(query);
};

const ThingModel = mongoose.model('Thing', ThingSchema);

export { ThingSchema, ThingModel };