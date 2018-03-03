import chai from './lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import { MeasurementModel } from '../src/models/measurement';
import { EventModel } from '../src/models/event';
import { ThingModel } from '../src/models/thing';
import { ObservationModel } from '../src/models/observation';
import server from '../src/index';
import constants from './constants/observations';
import authConstants from './constants/auth';
import responseKeys from '../src/utils/responseKeys';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const ensureNoObservationsCreated = (done) => {
    ObservationModel.find()
        .then((observations) => {
            if (_.isEmpty(observations)) {
                done();
            } else {
                done(new Error('Some observations have been created'));
            }
        }).catch((err) => {
            done(err);
        });
};

describe('Observations', () => {

    before((done) => {
        chai.request(server)
            .post('/api/auth/user')
            .set('Authorization', authConstants.validAuthHeader)
            .send(authConstants.validUser)
            .end((err) => {
                assert(err !== undefined, 'Error creating user');
                chai.request(server)
                    .post('/api/auth/token')
                    .set('Authorization', authConstants.validAuthHeader)
                    .send(authConstants.validUser)
                    .end((err, res) => {
                        assert(err !== undefined, 'Error obtaining token');
                        assert(res.body.token !== undefined, 'Error obtaining token');
                        token = res.body.token;
                        done();
                    });
            });
    });

    beforeEach((done) => {
        const promises = [MeasurementModel.remove({}), EventModel.remove({}), ThingModel.remove({})];
        Promise.all(promises)
            .then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
    });

    describe('POST /observations 304', () => {
        it('tries to create observations using an empty array', (done) => {
            const emptyObservations = {
                observations: [],
                thing: constants.validThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(emptyObservations)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_MODIFIED);
                    ensureNoObservationsCreated(done);
                });
        });
    });

    describe('POST /observations 400', () => {
        it('tries to create observations using an invalid payload', (done) => {
            const invalidPayload = {
                foo: [],
                thing: constants.validThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidPayload)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoObservationsCreated(done);
                });
        });
        it('tries to create invalid observations', (done) => {
            const invalidObservations = {
                observations: [
                    constants.invalidMeasurementWithKind,
                    constants.validMeasurementWithInvalidKind,
                    constants.invalidEventWithKind,
                    constants.validEventWithInvalidKind
                ],
                thing: constants.validThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidObservationsArrayKey]);
                    should.not.exist(res.body[responseKeys.createdObservationsArrayKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    res.body[responseKeys.invalidObservationsArrayKey].length.should.be.eql(_.size(invalidObservations.observations));
                    ensureNoObservationsCreated(done);
                });
        });
        it('tries to create observations with an invalid thing', (done) => {
            const invalidObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ],
                thing: constants.invalidThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidThingKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoObservationsCreated(done);
                });
        });
        it('tries to create observations with a thing that has an invalid geometry', (done) => {
            const invalidObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ],
                thing: constants.thingWithInvalidGeometry
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidThingKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoObservationsCreated(done);
                });
        });
    });

    describe('POST /observations 201', () => {
        it('creates observations', (done) => {
            const validObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ],
                thing: constants.validThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.not.exist(res.body[responseKeys.invalidObservationsArrayKey]);
                    should.exist(res.body[responseKeys.createdObservationsArrayKey]);
                    res.should.have.status(httpStatus.CREATED);
                    res.body[responseKeys.createdObservationsArrayKey].length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('POST /observations 207', () => {
        it('creates observations and also tries to create invalid ones', (done) => {
            const measurements = [
                constants.validMeasurementWithKind,
                constants.validMeasurementWithInvalidKind,
                constants.invalidMeasurementWithKind
            ];
            const events = [
                constants.validEventWithKind,
                constants.validEventWithInvalidKind,
                constants.invalidEventWithKind
            ];
            const validAndInvalidObservations = {
                observations: [
                    ...measurements,
                    ...events
                ],
                thing: constants.validThing
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validAndInvalidObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.exist(res.body[responseKeys.invalidObservationsArrayKey]);
                    should.exist(res.body[responseKeys.createdObservationsArrayKey]);
                    res.should.have.status(httpStatus.MULTI_STATUS);
                    res.body[responseKeys.invalidObservationsArrayKey].length.should.be.eql(4);
                    res.body[responseKeys.createdObservationsArrayKey].length.should.be.eql(2);
                    done();
                });
        });
    });
});
