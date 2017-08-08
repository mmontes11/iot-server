import chai from '../lib/chai';
import httpStatus from 'http-status';
import { EventSchema, EventModel } from '../src/models/db/event';
import server from '../index';

let token;
const assert = chai.assert;
const should = chai.should();

/*
describe('Event', () => {

    before((done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.validUser)
                .end((err, res) => {
                    res.should.have.status(httpStatus.CREATED);
                    chai.request(server)
                        .post('/api/user/logIn')
                        .set('Authorization', constants.validAuthHeader)
                        .send(constants.validUser)
                        .end((err, res) => {
                            chai.assert(err !== undefined, 'Error obtaining token');
                            chai.assert(res.body.token !== undefined, 'Error obtaining token');
                            token = res.body.token;
                            done();
                        });
                });
        chai.request(server)
            .post('/api/user/logIn')
            .set('Authorization', validAuthHeader)
            .send(validUser)
            .end((err, res) => {

            });
    });

    beforeEach((done) => {
        EventModel.remove({}, (err) => {
            chai.assert(err !== undefined, 'Error cleaning MongoDB for tests');
            done();
        });
    });

    describe('POST /event', () => {
        it('it should create an event', () => {
            chai.request(server)
                .post('/api/event')
                .set('Authorization', validAuthHeader)
                .send(validEvent)
                .end((err, res) => {
                    res.should.have.status(httpStatus.CREATED);
                    done();
                });
        });
    });
});
*/