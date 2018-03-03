import chai from './lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { ThingModel } from '../src/models/thing';
import server from '../src/index';
import responseKeys from '../src/utils/responseKeys';
import constants from './constants/thing';
import authConstants from './constants/auth';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const createthings = (things, done) => {
    Promise.each(things, (thing) => {
        const newthing = new ThingModel(thing);
        return newthing.save();
    }).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
};


describe('Thing', () => {

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

    before((done) => {
        ThingModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            const things = [constants.thingAtACoruna, constants.thingAtACoruna2, constants.thingAtNYC, constants.thingAtTokyo];
            createthings(things, done);
        });
    });

    describe('GET /thing/X 404', () => {
        it('tries to get a non existing thing', (done) => {
            chai.request(server)
                .get('/api/thing/whatever')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /thing/X 200', () => {
        it('gets an existing thing', (done) => {
            chai.request(server)
                .get('/api/thing/raspi-coruna')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    done();
                });
        });
    });

    describe('GET /things?latitude=X 400', () => {
        it('tries to get things using invalid coordinates', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    latitude: 42.08
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidCoordinateParamsKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /things?longitude=X&latitude=X 404', () => {
        it('gets things by Madagascar coordinates', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    longitude: -18.40,
                    latitude: 43.37
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /things?address=X 404', () => {
        it('tries to get things using an invalid address', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    address: 'foo'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
        it('gets things by Madagascar address', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    address: 'Madagascar'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /things 200', () => {
        it('gets all things', (done) => {
            chai.request(server)
                .get('/api/things')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body[responseKeys.thingsArrayKey].length.should.be.eql(4);
                    done();
                });
        });
    });

    describe('GET /things?longitude=X&latitude=X 200', () => {
        it('gets things by A Coruna coordinates', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    longitude: -8.4065665,
                    latitude: 43.3682188
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body[responseKeys.thingsArrayKey].length.should.be.eql(2);
                    done();
                });
        });

        it('gets things by A Coruna coordinates with max distance of 10 metres', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    longitude: -8.4065665,
                    latitude: 43.3682188,
                    maxDistance: 10
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body[responseKeys.thingsArrayKey].length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('GET /things?address=X 200', () => {
        it('gets things by A Coruna address', (done) => {
            chai.request(server)
                .get('/api/things')
                .query({
                    address: 'A Coruna'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body[responseKeys.thingsArrayKey].length.should.be.eql(2);
                    done();
                });
        });
    });
});