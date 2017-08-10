import chai from '../lib/chai';
import httpStatus from 'http-status';
import { UserSchema, UserModel } from '../src/models/db/user';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();

describe('User', () => {

    beforeEach((done) => {
        UserModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            done();
        });
    });

    describe('POST /user', () => {
        it('it should try to create a user with invalid credentials', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.invalidAuthHeader)
                .send(constants.validUser)
                .end((err,res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.UNAUTHORIZED);
                    done();
                });
        });
    });

    describe('POST /user', () => {
        it('it should try to create an invalid user', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.invalidUser)
                .end((err,res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /user', () => {
        it('it should try to create a user with weak password', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.userWithWeakPassword)
                .end((err,res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /user && POST /user/logIn', () => {
        it('it should create a user and log in', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.validUser)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);
                    chai.request(server)
                        .post('/api/user/logIn')
                        .set('Authorization', constants.validAuthHeader)
                        .send(constants.validUser)
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res.body.token);
                            res.should.have.status(httpStatus.OK);
                            done();
                        });
                });
        });
    });

    describe('POST /user && POST /user', () => {
        it('it should create the same user twice', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.validUser)
                .end((err, res) => {
                    res.should.have.status(httpStatus.CREATED);
                    chai.request(server)
                        .post('/api/user')
                        .set('Authorization', constants.validAuthHeader)
                        .send(constants.validUser)
                        .end((err, res) => {
                            should.exist(err);
                            res.should.have.status(httpStatus.CONFLICT);
                            done();
                        })
                });
        });
    });

    describe('POST /user/logIn', () => {
        it('it should try to log in with a non existing user', (done) => {
            chai.request(server)
                .post('/api/user/logIn')
                .set('Authorization', constants.validAuthHeader)
                .send(constants.validUser)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.UNAUTHORIZED);
                    done();
                });
        });
    });
});
