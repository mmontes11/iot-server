import chai from "./lib/chai";
import httpStatus from "http-status";
import Promise from "bluebird";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import authConstants from "./constants/auth";

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => `Bearer ${token}`;

describe("TimePeriod", () => {
  before(done => {
    chai
      .request(server)
      .post("/auth/user")
      .set("Authorization", authConstants.validAuthHeader)
      .send(authConstants.validUser)
      .end(err => {
        assert(err !== undefined, "Error creating user");
        chai
          .request(server)
          .post("/auth/token")
          .set("Authorization", authConstants.validAuthHeader)
          .send(authConstants.validUser)
          .end((err, res) => {
            assert(err !== undefined, "Error obtaining token");
            assert(res.body.token !== undefined, "Error obtaining token");
            token = res.body.token;
            done();
          });
      });
  });

  describe("GET /timePeriods 200", () => {
    it("gets all time periods", done => {
      chai
        .request(server)
        .get("/timePeriods")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          should.exist(res.body[responseKeys.timePeriodsArrayKey]);
          done();
        });
    });
  });
});
