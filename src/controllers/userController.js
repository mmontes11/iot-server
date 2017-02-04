import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import config from '../../config/env';

function createIfNotExists(req, res) {
    const query = user.UserModel.where({ userName: req.body.userName });
    query.findOne( (err, userFound) => {
        if (err) {
            handleError(res, err)
        } else {
            if (userFound) {
                res.sendStatus(httpStatus.CONFLICT)
            } else {
                const newUser = new user.UserModel({
                    userName: req.body.userName,
                    password: req.body.password
                });
                newUser.save()
                    .then( savedUser => res.json(savedUser))
                    .catch( err => {
                        handleError(res, err);
                    });
            }
        }
    });
}

function logIn(req, res) {
    const query = user.UserModel.where({ userName: req.body.userName, password: req.body.password });
    query.findOne( (err, user) => {
        if (err) {
            handleError(res, err)
        } else {
            if (!user) {
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

function handleError(res, err) {
    res.status(httpStatus.BAD_REQUEST).json(err);
}

export default { createIfNotExists, logIn };