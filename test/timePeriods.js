import chai from './lib/chai';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import server from '../src/index';
import responseKeys from '../src/utils/responseKeys';
import userConstants from './constants/user';

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => {
    return `Bearer ${token}`;
};

describe('thing', () => {

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

    describe('GET /timePeriods 200', () => {
        it('gets all time periods', (done) => {
            chai.request(server)
                .get('/api/timePeriods')
                .set('Authorization', auth())
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(httpStatus.OK);
                    should.exist(res.body[responseKeys.timePeriodsArrayKey]);
                    done();
                });
        });
    });
});