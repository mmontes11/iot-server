import chai from '../lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { EventSchema, EventModel } from '../src/models/db/event';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const createEvents = (events, done) => {
    const promises = [];
    for (const event of events) {
        const newEvent = new EventModel(event);
        promises.push(newEvent.save());
    }
    Promise.all(promises)
        .then(() => {
            done();
        })
        .catch((err) => {
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

    describe('POST /event', () => {
        it('it should create an event', (done) => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', auth())
                .send(constants.validEvent)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);
                    done();
                });
        });
    });

    describe('POST /event', () => {
        it('it should try to create an invalid event', (done) => {
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

    describe('POST /event/types', () => {
        beforeEach((done) => {
            const events = [constants.validEvent, constants.validEvent2, constants.validEvent3];
            createEvents(events, done);
        });
        it('it should get all event types', (done) => {
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
});