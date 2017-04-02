import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import requestUtils from '../utils/requestUtils';
import { UserSchema, UserModel } from '../models/user';
import config from '../../config/env';

function createIfNotExists(req, res) {
    const query = UserModel.where({ userName: req.body.userName });
    query.findOne( (err, userFound) => {
        if (err) {
            requestUtils.handleError(res, err)
        } else {
            if (userFound) {
                res.sendStatus(httpStatus.CONFLICT)
            } else {
                const newUser = new UserModel({
                    userName: req.body.userName,
                    password: req.body.password
                });
                newUser.save()
                    .then( savedUser => res.json(savedUser))
                    .catch( err => {
                        requestUtils.handleError(res, err);
                    });
            }
        }
    });
}

function logIn(req, res) {
    const query = UserModel.where({ userName: req.body.userName, password: req.body.password });
    query.findOne( (err, user) => {
        if (err) {
            requestUtils.handleError(res, err)
        } else {
            if (_.isUndefined(user)) {
                res.sendStatus(httpStatus.UNAUTHORIZED)
            } else {
                const token = jwt.sign({ userName: req.body.userName }, config.jwtSecret);
                return res.json({
                    token: token,
                    userName: req.body.userName
                })
            }
        }
    })
}

export default { createIfNotExists, logIn };