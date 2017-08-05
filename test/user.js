import chai from '../lib/chai';
import httpStatus from 'http-status';
import { UserSchema, UserModel } from '../src/models/db/user';
import server from '../index';

const validAuthHeader = "Basic YWRtaW46YWRtaW4=";
const invalidAuthHeader = "Whatever";
const validUser = {
    "userName": "testUser",
    "password": "aA12345678&"
};
const userWithWeakPassword = {
    "userName": "testUser",
    "password": "1234"
};

describe('User', () => {

    beforeEach((done) => {
        UserModel.remove({}, () => {
            done();
        });
    });

    describe('POST /user', () => {
        it('it should try to create a user with invalid credentials', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', invalidAuthHeader)
                .send(invalidAuthHeader)
                .end((err,res) => {
                    res.should.have.status(httpStatus.UNAUTHORIZED);
                    done();
                });
        });
    });

    describe('POST /user', () => {
        it('it should try to create a user with weak password', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', validAuthHeader)
                .send(userWithWeakPassword)
                .end((err,res) => {
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /user && POST /user/logIn', () => {
        it('it should create a user and log in', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', validAuthHeader)
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(httpStatus.CREATED);
                    chai.request(server)
                        .post('/api/user/logIn')
                        .set('Authorization', validAuthHeader)
                        .send(validUser)
                        .end((err, res) => {
                            res.should.have.status(httpStatus.OK);
                            res.body.token.should.not.be.undefined;
                            done();
                        });
                });
        });
    });

    describe('POST /user && POST /user', () => {
        it('it should create the same user twice', (done) => {
            chai.request(server)
                .post('/api/user')
                .set('Authorization', validAuthHeader)
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(httpStatus.CREATED);
                    chai.request(server)
                        .post('/api/user')
                        .set('Authorization', validAuthHeader)
                        .send(validUser)
                        .end((err, res) => {
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
                .set('Authorization', validAuthHeader)
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(httpStatus.UNAUTHORIZED);
                    done();
                });
        });
    });


});
