import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import { UserModel } from '../models/db/user';
import config from '../../config/index';
import responseHandler from '../helpers/responseHandler';

async function createIfNotExists(req, res) {
    const user = await UserModel.where({ username: req.body.username }).findOne();
    try {
        if (!_.isNull(user)) {
            res.sendStatus(httpStatus.CONFLICT);
        } else {
            const newUser = new UserModel({
                username: req.body.username,
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
    const user = await UserModel.where({ username: req.body.username, password: req.body.password }).findOne();
    try {
        if (_.isNull(user)) {
            res.sendStatus(httpStatus.UNAUTHORIZED)
        } else {
            const username = req.body.username;
            const token = jwt.sign({ username: username }, config.jwtSecret);
            const loginResponse = {
                token: token
            };
            responseHandler.handleResponse(res, loginResponse)
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
}

export default { createIfNotExists, logIn };