import chai from '../lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import { MeasurementModel } from '../src/models/db/measurement';
import { EventModel } from '../src/models/db/event';
import { DeviceModel } from '../src/models/db/device';
import { ObservationModel } from '../src/models/db/observation';
import server from '../index';
import constants from './constants/observations';
import userConstants from './constants/user';
import serverConstants from '../src/utils/constants';

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
            .post('/api/user')
            .set('Authorization', userConstants.validAuthHeader)
            .send(userConstants.validUser)
            .end((err) => {
                assert(err !== undefined, 'Error creating user');
                chai.request(server)
                    .post('/api/user/logIn')
                    .set('Authorization', userConstants.validAuthHeader)
                    .send(userConstants.validUser)
                    .end((err, res) => {
                        assert(err !== undefined, 'Error obtaining token');
                        assert(res.body.token !== undefined, 'Error obtaining token');
                        token = res.body.token;
                        done();
                    });
            });
    });

    beforeEach((done) => {
        const promises = [MeasurementModel.remove({}), EventModel.remove({}), DeviceModel.remove({})];
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
                device: constants.validDevice
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
                device: constants.validDevice
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
                device: constants.validDevice
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[serverConstants.invalidObservationsArrayName]);
                    should.not.exist(res.body[serverConstants.createdObservationsArrayName]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    res.body.invalidObservations.length.should.be.eql(_.size(invalidObservations.observations));
                    ensureNoObservationsCreated(done);
                });
        });
        it('tries to create observations with an invalid device', (done) => {
            const invalidObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ],
                device: constants.invalidDevice
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[serverConstants.invalidDeviceKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoObservationsCreated(done);
                });
        });
        it('tries to create observations with a device that has an invalid geometry', (done) => {
            const invalidObservations = {
                observations: [
                    constants.validMeasurementWithKind,
                    constants.validEventWithKind
                ],
                device: constants.deviceWithInvalidGeometry
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(invalidObservations)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[serverConstants.invalidDeviceKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoObservationsCreated(done);
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
                device: constants.validDevice
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validAndInvalidObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.exist(res.body[serverConstants.invalidObservationsArrayName]);
                    should.exist(res.body[serverConstants.createdObservationsArrayName]);
                    res.should.have.status(httpStatus.MULTI_STATUS);
                    res.body[serverConstants.invalidObservationsArrayName].length.should.be.eql(4);
                    res.body[serverConstants.createdObservationsArrayName].length.should.be.eql(2);
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
                ],
                device: constants.validDevice
            };
            chai.request(server)
                .post('/api/observations')
                .set('Authorization', auth())
                .send(validObservations)
                .end((err, res) => {
                    should.not.exist(err);
                    should.not.exist(res.body[serverConstants.invalidObservationsArrayName]);
                    should.exist(res.body[serverConstants.createdObservationsArrayName]);
                    res.should.have.status(httpStatus.CREATED);
                    res.body[serverConstants.createdObservationsArrayName].length.should.be.eql(2);
                    done();
                });
        });
    });
});
