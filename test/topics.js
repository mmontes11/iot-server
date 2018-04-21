import chai from "./lib/chai";
import httpStatus from "http-status";
import Promise from "bluebird";
import { TopicModel } from "../src/models/topic";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import constants from "./constants/topics";
import authConstants from "./constants/auth";

const assert = chai.assert;
const should = chai.should();
let token = null;
const auth = () => `Bearer ${token}`;

describe("Topics", () => {
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

  before(done => {
    TopicModel.remove({}, err => {
      assert(err !== undefined, "Error cleaning MongoDB for tests");
      done();
    });
  });

  describe("GET /topics 404", done => {
    it("tries to get topics but no one has been created yet", done => {
      chai
        .request(server)
        .get("/topics")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /topics 200", done => {
    before(done => {
      const topics = [constants.validTopic, constants.validTopic2, constants.validTopic3];
      Promise.each(topics, topic => {
        const newTopic = new TopicModel(topic);
        return newTopic.save();
      })
        .then(() => {
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("gets topics", done => {
      chai
        .request(server)
        .get("/topics")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res.body[responseKeys.topicsArrayKey]);
          res.should.have.status(httpStatus.OK);
          done();
        });
    });
  });
});
