import { MeasurementModel } from './measurement';
import { EventModel } from './event';
import { ObservationKind } from '../request/observationKind'
import requestValidator from '../../helpers/requestValidator';
import _ from 'underscore';

const createObservation = (observation) => {
    const observationKind = observation.kind;
    if (_.isUndefined(observationKind)) {
        throw Error('observation.kind path is undefined');
    }
    delete observation.kind;
    const invalidObservationError = Error('Invalid observation');
    switch (observationKind) {
        case ObservationKind.measurementKind: {
            if (requestValidator.validateMeasurement(observation)) {
                return new MeasurementModel(observation);
            } else {
                throw invalidObservationError;
            }
        }
        case ObservationKind.eventKind: {
            if (requestValidator.validateEvent(observation)) {
                return new EventModel(observation);
            } else {
                throw invalidObservationError;
            }
        }
        default: {
            throw Error(`Unsupported observation kind: ${observationKind}`);
        }
    }
};

export default { createObservation };