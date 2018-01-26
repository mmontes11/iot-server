import chai from './lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import moment from 'moment';
import { MeasurementModel } from '../src/models/db/measurement';
import { ThingModel } from '../src/models/db/thing';
import { TimePeriod } from '../src/models/request/timePeriod';
import statsCache from '../src/cache/statsCache';
import redisClient from '../src/lib/redis';
import server from '../src/index';
import constants from './constants/measurement';
import userConstants from './constants/user';
import responseKeys from '../src/utils/responseKeys';

import config from '../src/config/index';

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
const performMeasurementCreationRequest = (measurementRequests, done) => {
    Promise.all(measurementRequests)
        .then(() => {
            done();
        }).catch((err) => {
            done(err);
        });
};
const ensureNoMeasurementsCreated = (done) => {
    MeasurementModel.find()
        .then((measurements) => {
            if (_.isEmpty(measurements)) {
                done();
            } else {
                done(new Error('Some measurements have been created'));
            }
        }).catch((err) => {
            done(err);
        });
};
const testCachedStats = (type, thing, lastTimePeriod, res, done) => {
    statsCache.getStatsCache(type, thing, lastTimePeriod)
        .then((cachedStats) => {
            res.body.stats.should.be.eql(cachedStats);
            setTimeout(() => {
                statsCache.getStatsCache(type, thing, lastTimePeriod)
                    .then((cachedStats) => {
                        should.not.exist(cachedStats);
                        MeasurementModel.getStats(type, thing, lastTimePeriod)
                            .then((statsFromDB) => {
                                res.body.stats.should.be.eql(statsFromDB);
                                done();
                            }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                        done(err);
                    });
            }, config.statsCacheInSeconds * 1000 + 1);
        }).catch((err) => {
            done(err);
        });
};

describe('Measurement', () => {

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
        const promises = [MeasurementModel.remove({}), ThingModel.remove({}), redisClient.flushall()];
        Promise.all(promises)
            .then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
    });

    describe('POST /measurement 400', () => {
        it('tries to create an invalid measurement', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.measurementRequestWithInvalidMeasurement)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoMeasurementsCreated(done);
                });
        });
        it('tries to create a measurement with an invalid thing', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.measurementRequestWithInvalidThing)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoMeasurementsCreated(done);
                });
        });
        it('tries to create a measurement with a thing that has an invalid geometry', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.measurementRequestWithThingWithInvalidGeometry)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidThingKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoMeasurementsCreated(done);
                });
        });
    });

    describe('POST /measurement 200', () => {
        it('creates a measurement', (done) => {
            chai.request(server)
                .post('/api/measurement')
                .set('Authorization', auth())
                .send(constants.validMeasurementRequestWithThingInCoruna)
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

    describe('GET /measurement/types 200', () => {
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

    describe('GET /measurement/last 200', () => {
        beforeEach((done) => {
            const events = [constants.temperatureMeasurement, constants.temperatureMeasurement2,
                constants.humidityMeasurement, constants.humidityMeasurement2];
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

    describe('GET /measurement/last?type=X 404', () => {
        it('gets the last measurement of a non existing type', (done) => {
            chai.request(server)
                .get('/api/measurement/last')
                .query({
                    'type': 'whatever'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/last?type=X 200', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2,
                constants.humidityMeasurement, constants.humidityMeasurement2];
            createMeasurements(measurements, done);
        });
        it('gets the last temperature measurement', (done) => {
            chai.request(server)
                .get('/api/measurement/last')
                .query({
                    'type': 'temperature'
                })
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

    describe('GET /measurement/stats 404', () => {
        it('gets measurement stats but no measurement has been created', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/stats 400', () => {
        it('gets measurement stats of a non valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'lastTimePeriod': 'whatever'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidLastTimePeriodKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('gets measurement stats of a non valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': '1-1-2013',
                    'endDate': '1-1-2018'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidDateRangeKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('gets measurement stats of a non valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': '2016-01-01',
                    'endDate': '2015-01-01'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidDateRangeKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('gets measurement stats of a non valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': '2016-01-01T01:00:00.000Z',
                    'endDate': '2015-01-01T01:00:00.000Z'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidDateRangeKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /measurement/stats 200', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.temperatureMeasurement3,
                constants.humidityMeasurement, constants.humidityMeasurement2, constants.humidityMeasurement3];
            createMeasurements(measurements, done);
        });
        it('gets measurement stats', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(4);
                    testCachedStats(undefined, undefined, undefined, res, done);
                });
        });
        it('gets measurement stats of a valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(4);
                    testCachedStats(undefined, undefined, new TimePeriod('month'), res, done);
                });
        });
        it('gets measurement stats of a valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': moment().utc().subtract(1, 'minute').toISOString()
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(4);
                    done();
                });
        });
        it('gets measurement stats of a valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': moment().utc().subtract(1, 'minute').toISOString(),
                    'endDate': moment().utc().add(1, 'minute').toISOString()
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(4);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?type=X 404', () => {
        it('gets measurement stats by type but no measurement has been created', (done) => {
            chai.request(server)
                .get('/api/measurement/whatever/stats')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?type=X 200', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2,
                constants.humidityMeasurement, constants.humidityMeasurement2];
            createMeasurements(measurements, done);
        });
        it('gets temperature measurement stats', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    testCachedStats('temperature', undefined, undefined, res, done);
                });
        });
        it('gets temperature measurement stats of a valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature',
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    testCachedStats('temperature', undefined, new TimePeriod('month'), res, done);
                });
        });
        it('gets temperature measurement stats of a valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature',
                    'startDate': moment().utc().subtract(1, 'minute').toISOString(),
                    'endDate': moment().utc().add(1, 'minute').toISOString()
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?thing=X 404', () => {
        it('gets measurement stats by thing but no measurement has been created', (done) => {
            chai.request(server)
                .get('/api/measurement/whatever/stats')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?thing=X 200', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.temperatureMeasurement3,
                constants.humidityMeasurement3];
            createMeasurements(measurements, done);
        });
        it('gets raspberry measurement stats', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'thing': 'raspberry'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(2);
                    testCachedStats(undefined, 'raspberry', undefined, res, done);
                });
        });
        it('gets raspberry measurement stats of a valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'thing': 'raspberry',
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(2);
                    testCachedStats(undefined, 'raspberry', new TimePeriod('month'), res, done);
                });
        });
        it('gets raspberry measurement stats of a valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'thing': 'raspberry',
                    'startDate': moment().utc().subtract(1, 'minute').toISOString(),
                    'endDate': moment().utc().add(1, 'minute').toISOString()
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(2);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?type=X&thing=Y 200', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.temperatureMeasurement3,
                constants.humidityMeasurement, constants.humidityMeasurement2, constants.humidityMeasurement3];
            createMeasurements(measurements, done);
        });
        it('gets temperature raspberry measurement stats', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature',
                    'thing': 'raspberry'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    testCachedStats('temperature', 'raspberry', undefined, res, done);
                });
        });
        it('gets temperature raspberry measurement stats of a valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature',
                    'thing': 'raspberry',
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    testCachedStats('temperature', 'raspberry', new TimePeriod('month'), res, done);
                });
        });
        it('gets temperature raspberry measurement stats of a valid custom time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'type': 'temperature',
                    'thing': 'raspberry',
                    'startDate': moment().utc().subtract(1, 'minute').toISOString(),
                    'endDate': moment().utc().add(1, 'minute').toISOString()
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?address=X 404', () => {
        beforeEach((done) => {
            const measurementRequestBodies = [constants.validMeasurementRequestWithThingInCoruna, constants.validMeasurementRequestWithThingInNYC];
            const measurementRequestPromises = _.map(measurementRequestBodies, (measurementRequestBody) => {
                return new Promise((resolve, reject) => {
                    chai.request(server)
                        .post('/api/measurement')
                        .set('Authorization', auth())
                        .send(measurementRequestBody)
                        .end((err, res) => {
                            if (_.isUndefined(err)) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        });
                });
            });
            performMeasurementCreationRequest(measurementRequestPromises, done);
        });
        it('gets stats from an address that has no things', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'address': 'Tombuctú',
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
        it('gets stats from a non existing address', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'address': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?address=X 200', () => {
        beforeEach((done) => {
            const measurementRequestBodies = [constants.validMeasurementRequestWithThingInCoruna, constants.validMeasurementRequestWithThingInNYC];
            const measurementRequestPromises = _.map(measurementRequestBodies, (measurementRequestBody) => {
                return new Promise((resolve, reject) => {
                    chai.request(server)
                        .post('/api/measurement')
                        .set('Authorization', auth())
                        .send(measurementRequestBody)
                        .end((err, res) => {
                            if (_.isUndefined(err)) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        });
                });
            });
            performMeasurementCreationRequest(measurementRequestPromises, done);
        });
        it('gets stats from A Coruña address', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'address': 'A Coruña',
                    'maxDistance': 100000
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
        it('gets stats from NYC address', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'address': 'Times Square',
                    'maxDistance': 100000
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?longitude=X&latitude=Y 404', () => {
        beforeEach((done) => {
            const measurementRequestBodies = [constants.validMeasurementRequestWithThingInCoruna, constants.validMeasurementRequestWithThingInNYC];
            const measurementRequestPromises = _.map(measurementRequestBodies, (measurementRequestBody) => {
                return new Promise((resolve, reject) => {
                    chai.request(server)
                        .post('/api/measurement')
                        .set('Authorization', auth())
                        .send(measurementRequestBody)
                        .end((err, res) => {
                            if (_.isUndefined(err)) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        });
                });
            });
            performMeasurementCreationRequest(measurementRequestPromises, done);
        });
        it('gets stats from  coordinates that have no things', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'longitude': -3.0167342,
                    'latitude': 16.7714039
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /measurement/stats?longitude=X&latitude=Y 200', () => {
        beforeEach((done) => {
            const measurementRequestBodies = [constants.validMeasurementRequestWithThingInCoruna, constants.validMeasurementRequestWithThingInNYC];
            const measurementRequestPromises = _.map(measurementRequestBodies, (measurementRequestBody) => {
                return new Promise((resolve, reject) => {
                    chai.request(server)
                        .post('/api/measurement')
                        .set('Authorization', auth())
                        .send(measurementRequestBody)
                        .end((err, res) => {
                            if (_.isUndefined(err)) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        });
                });
            });
            performMeasurementCreationRequest(measurementRequestPromises, done);
        });
        it('gets stats from A Coruña coordinates', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'longitude': -8.4165665,
                    'latitude': 43.3682188
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
        it('gets stats from NYC coordinates', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'longitude': -74.25,
                    'latitude': 40.69
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('object');
                    res.body.stats.should.be.a('array');
                    res.body.stats.length.should.be.equal(1);
                    done();
                });
        });
    });
});