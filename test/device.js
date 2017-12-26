import chai from '../lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import { DeviceModel } from '../src/models/db/device';
import server from '../index';
import constants from './constants';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};
const createDevices = (devices, done) => {
    Promise.each(devices, (device) => {
        device.lastObservation = new Date();
        const newDevice = new DeviceModel(device);
        return newDevice.save();
    }).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
};


describe('Device', () => {

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

    before((done) => {
        DeviceModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            const devices = [constants.deviceAtACoruna, constants.deviceAtACoruna2, constants.deviceAtNYC, constants.deviceAtTokyo];
            createDevices(devices, done);
        });
    });

    describe('GET /device/whatever 404', () => {
        it('tries to get a non existing device', (done) => {
            chai.request(server)
                .get('/api/device/whatever')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    describe('GET /device/raspi-coruna 200', () => {
        it('gets an existing device', (done) => {
            chai.request(server)
                .get('/api/device/raspi-coruna')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    done();
                });
        });
    });

    describe('GET /devices 200', () => {
        it('gets all devices', (done) => {
            chai.request(server)
                .get('/api/devices')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.devices.length.should.be.eql(4);
                    done();
                });
        });
    });

    describe('GET /devices?latitude=42.08 400', () => {
        it('tries to get devices using invalid coordinates', (done) => {
            chai.request(server)
                .get('/api/devices')
                .query({
                    latitude: 42.08
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(httpStatus.BAD_REQUEST);
                    done();
                });
        });
    });

    describe('GET /devices?longitude=-18.40&latitude=43.37 404', () => {
        it('gets devices by Madagascar coordinates', (done) => {
            chai.request(server)
                .get('/api/devices')
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

    describe('GET /devices?longitude=-8.4065665&latitude=43.3682188 200', () => {
        it('gets devices by A Coruna coordinates', (done) => {
            chai.request(server)
                .get('/api/devices')
                .query({
                    longitude: -8.4065665,
                    latitude: 43.3682188
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.devices.length.should.be.eql(2);
                    done();
                });
        });

        it('gets devices by A Coruna coordinates with max distance of 10 metres', (done) => {
            chai.request(server)
                .get('/api/devices')
                .query({
                    longitude: -8.4065665,
                    latitude: 43.3682188,
                    maxDistance: 10
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.devices.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('GET /devices?address=foo 404', () => {
        it('tries to get devices using an invalid address', (done) => {
            chai.request(server)
                .get('/api/devices')
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
    });

    describe('GET /devices?address=Madagascar 404', () => {
        it('gets devices by Madagascar address', (done) => {
            chai.request(server)
                .get('/api/devices')
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

    describe('GET /devices?address=A Coruña 200', () => {
        it('gets devices by A Coruna address', (done) => {
            chai.request(server)
                .get('/api/devices')
                .query({
                    address: 'Obelisco, A Coruna'
                })
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    res.body.devices.length.should.be.eql(2);
                    done();
                });
        });
    });
});