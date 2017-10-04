import chai from '../lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import { MeasurementModel } from '../src/models/db/measurement';
import { EventModel } from '../src/models/db/event';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};

describe('Observations', () => {

    before((done) => {
        chai.request(server)
            .post('/api/user')
            .set('Authorization', constants.validAuthHeader)
            .send(constants.validUser)
            .end((err) => {
                assert(err !== undefined, 'Error creating user');
                chai.request(server)
                    .post('/api/user/logIn')
                    .set('Authorization', constants.validAuthHeader)
                    .send(constants.validUser)
                    .end((err, res) => {
                        assert(err !== undefined, 'Error obtaining token');
                        assert(res.body.token !== undefined, 'Error obtaining token');
                        token = res.body.token;
                        done();
                    });
            });
    });

    beforeEach((done) => {
        const promises = [MeasurementModel.remove({}), EventModel.remove({})];
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
                observations: []
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(emptyObservations)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_MODIFIED);
                    done();
                });
        });
    });

    describe('POST /observations 400', () => {
        it('tries to create observations using an invalid payload', (done) => {
            const invalidPayload = {
                foo: []
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidPayload)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('tries to create invalid observations', (done) => {
            const invalidObservations = {
                observations: [
                    constants.invalidMeasurementWithKind,
                    constants.validMeasurementWithInvalidKind,
                    constants.invalidEventWithKind,
                    constants.validEventWithInvalidKind
                ]
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body.invalidObservations);
                    should.not.exist(res.body.createdObservations);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    res.body.invalidObservations.length.should.be.eql(_.size(invalidObservations.observations));
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
                ]
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validAndInvalidObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.exist(res.body.invalidObservations);
                    should.exist(res.body.createdObservations);
                    res.should.have.status(httpStatus.MULTI_STATUS);
                    res.body.invalidObservations.length.should.be.eql(4);
                    res.body.createdObservations.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('POST /observations 201', () => {
        it('creates observations', (done) => {
            const validObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ]
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.not.exist(res.body.invalidObservations);
                    should.exist(res.body.createdObservations);
                    res.should.have.status(httpStatus.CREATED);
                    res.body.createdObservations.length.should.be.eql(2);
                    done();
                });
        });
    });
});
