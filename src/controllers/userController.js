import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import { UserSchema, UserModel } from '../models/db/user';
import config from '../../config/env';
import responseHandler from '../helpers/responseHandler';

async function createIfNotExists(req, res) {
    const user = await UserModel.where({ userName: req.body.userName }).findOne();
    try {
        if (!_.isUndefined(user)) {
            res.sendStatus(httpStatus.CONFLICT);
        } else {
            const newUser = new UserModel({
                userName: req.body.userName,
                password: req.body.password
            });
            const savedUser = await newUser.save();
            responseHandler.handleResponse(res, savedUser);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

function logIn(req, res) {
    const user = UserModel.where({ userName: req.body.userName, password: req.body.password }).findOne();
    try {
        if (_.isUndefined(user)) {
            res.sendStatus(httpStatus.UNAUTHORIZED)
        } else {
            const userName = req.body.userName;
            const token = jwt.sign({ userName: userName }, config.jwtSecret);
            const loginResponse = {
                userName: userName,
                token: token
            };
            responseHandler.handleResponse(res, loginResponse)
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

export default { createIfNotExists, logIn };