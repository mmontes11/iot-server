import chai from '../lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { MeasurementSchema, MeasurementModel } from '../src/models/db/measurement';
import statsCache from '../src/cache/statsCache';
import redisClient from '../lib/redis';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const createMeasurements = (measurements, done) => {
    Promise.each(measurements, (measurement) => {
        measurement.phenomenonTime = new Date();
        const newMeasurement = new MeasurementModel(measurement);
        return newMeasurement.save();
    }).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
};

describe('Measurement', () => {

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
        const promises = [MeasurementModel.remove({}), redisClient.flushall()];
        Promise.all(promises)
            .then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
    });

    describe('POST /measurement', () => {
        it('tries to create a invalid measurement', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.inValidMeasurement)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /measurement', () => {
        it('creates a measurement', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.temperatureMeasurement)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);
                    done();
                });
        });
    });

    describe('GET /measurement/types 404', () => {
        it('gets all measurement types but no one has been created yet', (done) => {
            chai.request(server)
                .get('/api/measurement/types')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/types', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.humidityMeasurement];
            createMeasurements(measurements, done);
        });
        it('gets all measurement types', (done) => {
            chai.request(server)
                .get('/api/measurement/types')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.types.should.be.a('array');
                    res.body.types.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('GET /measurement/last 404', () => {
        it('gets the last measurement but no one has been created yet', (done) => {
            chai.request(server)
                .get('/api/measurement/last')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /event/last', () => {
        beforeEach((done) => {
            const events = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.humidityMeasurement, constants.humidityMeasurement2];
            createMeasurements(events, done);
        });
        it('gets the last measurement', (done) => {
            chai.request(server)
                .get('/api/measurement/last')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.type.should.be.a('string');
                    res.body.type.should.equal('humidity');
                    done();
                });
        });
    });

    describe('GET /measurement/:type/last 404', () => {
        it('gets the last measurement of a non existing type', (done) => {
            chai.request(server)
                .get('/api/measurement/whatever/last')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/:type/last', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.humidityMeasurement, constants.humidityMeasurement2];
            createMeasurements(measurements, done);
        });
        it('gets the last temperature measurement', (done) => {
            chai.request(server)
                .get('/api/measurement/temperature/last')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.type.should.be.a('string');
                    res.body.type.should.equal('temperature');
                    res.body.value.should.be.a('number');
                    res.body.value.should.equal(15);
                    done();
                });
        });
    });
});