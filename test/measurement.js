import chai from '../lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import moment from 'moment';
import { MeasurementModel } from '../src/models/db/measurement';
import { TimePeriod } from '../src/models/request/timePeriod';
import statsCache from '../src/cache/statsCache';
import redisClient from '../lib/redis';
import server from '../index';
import constants from './constants';
import config from '../config/index';

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
const testCachedStats = (type, device, lastTimePeriod, res, done) => {
    statsCache.getStatsCache(type, device, lastTimePeriod)
        .then((cachedStats) => {
            res.body.stats.should.be.eql(cachedStats);
            setTimeout(() => {
                statsCache.getStatsCache(type, device, lastTimePeriod)
                    .then((cachedStats) => {
                        should.not.exist(cachedStats);
                        MeasurementModel.getStats(type, device, lastTimePeriod)
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

    describe('POST /measurement 400', () => {
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

    describe('GET /measurement/last?type=whatever 404', () => {
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

    describe('GET /measurement/last?type=temperature', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.humidityMeasurement, constants.humidityMeasurement2];
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
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('gets measurement stats of a non valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'startDate': '2016-01-01T01:00:00.000Z',
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
        it('gets measurement stats of a non valid time period', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'endDate': '2016-01-01T01:00:00.000Z',
                    'lastTimePeriod': 'month'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
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
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /measurement/stats', () => {
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

    describe('GET /measurement/stats?type=whatever 404', () => {
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

    describe('GET /measurement/stats?type=temperature', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.humidityMeasurement, constants.humidityMeasurement2];
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

    describe('GET /measurement/stats?device=whatever 404', () => {
        it('gets measurement stats by device but no measurement has been created', (done) => {
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

    describe('GET /measurement/stats?device=raspberry', () => {
        beforeEach((done) => {
            const measurements = [constants.temperatureMeasurement, constants.temperatureMeasurement2, constants.temperatureMeasurement3, constants.humidityMeasurement3];
            createMeasurements(measurements, done);
        });
        it('gets raspberry measurement stats', (done) => {
            chai.request(server)
                .get('/api/measurement/stats')
                .query({
                    'device': 'raspberry'
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
                    'device': 'raspberry',
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
                    'device': 'raspberry',
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

    describe('GET /measurement/stats?type=temperature&device=raspberry', () => {
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
                    'device': 'raspberry'
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
                    'device': 'raspberry',
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
                    'device': 'raspberry',
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

});