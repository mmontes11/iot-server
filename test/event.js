import chai from '../lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { EventModel } from '../src/models/db/event';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const createEvents = (events, done) => {
    Promise.each(events, (event) => {
        event.phenomenonTime = new Date();
        const newEvent = new EventModel(event);
        return newEvent.save();
    }).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
};

describe('Event', () => {

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
        EventModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            done();
        });
    });

    describe('POST /event 400', () => {
        it('tries to create an invalid event', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.inValidEvent)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /event', () => {
        it('creates an event', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.doorOpenedEvent)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);
                    done();
                });
        });
    });

    describe('GET /event/types 404', () => {
        it('gets all event types but no one has been created yet', (done) => {
            chai.request(server)
                .get('/api/event/types')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /event/types', () => {
        beforeEach((done) => {
            const events = [constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent];
            createEvents(events, done);
        });
        it('gets all event types', (done) => {
            chai.request(server)
                .get('/api/event/types')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.types.should.be.a('array');
                    res.body.types.length.should.be.eql(3);
                    done();
                });
        });
    });

    describe('GET /event/last 404', () => {
        it('gets the last event but no one has been created yet', (done) => {
            chai.request(server)
                .get('/api/event/last')
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
            const events = [constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent];
            createEvents(events, done);
        });
        it('gets the last event', (done) => {
            chai.request(server)
                .get('/api/event/last')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.type.should.be.a('string');
                    res.body.type.should.equal('window_opened');
                    done();
                });
        });
    });

    describe('GET /event/last?type=whatever 404', () => {
        it('gets the last event of a non existing type', (done) => {
            chai.request(server)
                .get('/api/event/last?type=whatever')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /event/last?type=door_closed', () => {
        beforeEach((done) => {
            const events = [constants.doorOpenedEvent, constants.doorClosedEvent,  constants.windowOpenedEvent, constants.doorClosedEvent2];
            createEvents(events, done);
        });
        it('gets the last door closed event', (done) => {
            chai.request(server)
                .get('/api/event/last?type=door_closed')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    console.log(res.body);
                    res.should.have.status(httpStatus.OK);
                    res.body.type.should.be.a('string');
                    res.body.type.should.equal('door_closed');
                    res.body.device.should.be.a('string');
                    res.body.device.should.equal('arduino');
                    done();
                });
        });
    });

});