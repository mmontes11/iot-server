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

    beforeEach((done) => {
        DeviceModel.remove({}, (err) => {
            assert(err !== undefined, 'Error cleaning MongoDB for tests');
            done();
        });
    });

    describe('GET /devices 200', () => {

        beforeEach((done) => {
            const devices = [constants.deviceAtACoruna, constants.deviceAtACoruna2, constants.deviceAtNYC, constants.deviceAtTokyo];
            createDevices(devices, done);
        });

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

});