import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import { UserSchema, UserModel } from '../models/db/user';
import config from '../../config/index';
import responseHandler from '../helpers/responseHandler';

async function createIfNotExists(req, res) {
    const user = await UserModel.where({ userName: req.body.userName }).findOne();
    try {
        if (!_.isNull(user)) {
            res.sendStatus(httpStatus.CONFLICT);
        } else {
            const newUser = new UserModel({
                userName: req.body.userName,
                password: req.body.password
            });
            await newUser.save();
            res.sendStatus(httpStatus.CREATED);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

async function logIn(req, res) {
    const user = await UserModel.where({ userName: req.body.userName, password: req.body.password }).findOne();
    try {
        if (_.isNull(user)) {
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