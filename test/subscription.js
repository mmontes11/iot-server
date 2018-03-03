import chai from './lib/chai';
import httpStatus from 'http-status';
import _ from 'underscore';
import Promise from 'bluebird';
import { SubscriptionModel } from '../src/models/subscription';
import server from '../src/index';
import constants from './constants/observations';
import authConstants from './constants/auth';
import subscriptionConstants from './constants/subscription';
import responseKeys from '../src/utils/responseKeys';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};


describe('Subscriptions', () => {

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

    beforeEach((done) => {
        SubscriptionModel.remove({})
            .then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
    });

    describe('POST /subscription 400', () => {
        it('tries to create an invalid subscription', (done) => {
            chai.request(server)
                .post('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.invalidSubscription)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('POST /subscription 304', () => {
        it('tries to recreate an already created subscription', (done) => {
            chai.request(server)
                .post('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.validSubscription)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);

                    chai.request(server)
                        .post('/api/subscription')
                        .set('Authorization', auth())
                        .send(subscriptionConstants.validSubscription)
                        .end((err, res) => {
                            should.exist(err);
                            res.should.have.status(httpStatus.NOT_MODIFIED);
                            done();
                        });
                });
        });
    });

    describe('POST /subscription 201', () => {
        it('creates a subscription', (done) => {
            chai.request(server)
                .post('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.validSubscription)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);
                    done();
                });
        });
    });

    describe('DELETE /subscription 400', () => {
        it('tries to delete an invalid subscription', (done) => {
            chai.request(server)
                .delete('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.invalidSubscription)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('DELETE /subscription 404', () => {
        it('tries to delete a non existing subscription', (done) => {
            chai.request(server)
                .delete('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.validSubscription)
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('DELETE /subscription 200', () => {
        it('deletes a subscription', (done) => {
            chai.request(server)
                .post('/api/subscription')
                .set('Authorization', auth())
                .send(subscriptionConstants.validSubscription)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.CREATED);

                    chai.request(server)
                        .delete('/api/subscription')
                        .set('Authorization', auth())
                        .send(subscriptionConstants.validSubscription)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(httpStatus.OK);
                            done();
                        });
                });
        });
    });

    describe('GET /subscriptions 400', () => {
        it('tries to get subscriptions but no chatId query param is specified', (done) => {
            chai.request(server)
                .get('/api/subscriptions')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.mandatoryQueryParamKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /subscriptions 400', () => {
        it('tries to get subscriptions with an invalid chatId query param', (done) => {
            chai.request(server)
                .get('/api/subscriptions')
                .set('Authorization', auth())
                .query({
                    [responseKeys.chatIdKey]: subscriptionConstants.invalidChatId
                })
                .end((err, res) => {
                    should.exist(err);
                    should.exist(res.body[responseKeys.invalidQueryParamKey]);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /subscriptions 404', () => {
        it('tries to get subscriptions but no one has been created yet', (done) => {
            chai.request(server)
                .get('/api/subscriptions')
                .set('Authorization', auth())
                .query({
                    [responseKeys.chatIdKey]: subscriptionConstants.validChatId
                })
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /subscriptions 200', () => {
        it('gets subscriptions', (done) => {
            const subscriptions = [
                subscriptionConstants.validSubscription,
                subscriptionConstants.validSubscription2,
                subscriptionConstants.validSubscription3
            ];
            const promises = _.map(subscriptions, (subscription) => {
                const newSubscription = new SubscriptionModel(subscription);
                return newSubscription.save();
            });
            Promise.all(promises)
                .then(() => {
                    chai.request(server)
                        .get('/api/subscriptions')
                        .set('Authorization', auth())
                        .query({
                            [responseKeys.chatIdKey]: subscriptionConstants.validChatId2
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(httpStatus.OK);
                            res.body[responseKeys.subscriptionsArrayKey].length.should.be.eql(2);

                            chai.request(server)
                                .delete('/api/subscription')
                                .set('Authorization', auth())
                                .send(subscriptionConstants.validSubscription2)
                                .end((err, res) => {
                                    should.not.exist(err);
                                    res.should.have.status(httpStatus.OK);

                                    chai.request(server)
                                        .get('/api/subscriptions')
                                        .set('Authorization', auth())
                                        .query({
                                            [responseKeys.chatIdKey]: subscriptionConstants.validChatId2
                                        })
                                        .end((err, res) => {
                                            should.not.exist(err);
                                            res.should.have.status(httpStatus.OK);
                                            res.body[responseKeys.subscriptionsArrayKey].length.should.be.eql(1);
                                            done();
                                        });
                                });
                        });
                })
                .catch((err) => {
                    done(err);
                });

        });
    });

});