import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import { UserModel } from '../models/user';
import modelFactory from '../models/modelFactory';
import config from '../config/index';
import responseHandler from '../helpers/responseHandler';

 const createUserIfNotExists = async (req, res) => {
    const user = await UserModel.where({ username: req.body.username }).findOne();
    try {
        if (!_.isNull(user)) {
            res.sendStatus(httpStatus.CONFLICT);
        } else {
            const newUser = modelFactory.createUser(req.body);
            await newUser.save();
            res.sendStatus(httpStatus.CREATED);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

 const getToken = async (req, res) => {
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
};

export default { createUserIfNotExists, getToken };