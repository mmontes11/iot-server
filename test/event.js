import chai from '../lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import { EventModel } from '../src/models/db/event';
import { DeviceModel } from '../src/models/db/device';
import server from '../index';
import constants from './constants/event';
import userConstants from './constants/user';
import serverConstants from '../src/utils/constants';

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
const ensureNoEventsCreated = (done) => {
    EventModel.find()
        .then((events) => {
            if (_.isEmpty(events)) {
                done();
            } else {
                done(new Error('Some events have been created'));
            }
        }).catch((err) => {
            done(err);
        });
};

describe('Event', () => {

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
        const promises = [EventModel.remove({}), DeviceModel.remove({})];
        Promise.all(promises)
            .then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
    });

    describe('POST /event 400', () => {
        it('tries to create an invalid event', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.eventRequestWithInvalidEvent)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoEventsCreated(done);
                });
        });
        it('tries to create an event with an invalid device', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.eventRequestWithInvalidDevice)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoEventsCreated(done);
                });
        });
        it('tries to create an event with a device that has an invalid geometry', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.eventRequestWithDeviceWithInvalidGeometry)
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[serverConstants.invalidDeviceKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    ensureNoEventsCreated(done);
                });
        });
    });

    describe('POST /event 200', () => {
        it('creates an event', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.validEventRequest)
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

    describe('GET /event/types 200', () => {
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

    describe('GET /event/last 200', () => {
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

    describe('GET /event/last?type=X 404', () => {
        it('gets the last event of a non existing type', (done) => {
            chai.request(server)
                .get('/api/event/last')
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

    describe('GET /event/last?type=X 200', () => {
        beforeEach((done) => {
            const events = [constants.doorOpenedEvent, constants.doorClosedEvent,  constants.windowOpenedEvent, constants.doorClosedEvent2];
            createEvents(events, done);
        });
        it('gets the last door closed event', (done) => {
            chai.request(server)
                .get('/api/event/last')
                .query({
                    'type': 'door_closed'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
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