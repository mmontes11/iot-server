import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import config from '../../config/env';

function createIfNotExists(req, res) {
    const query = User.where({ userName: req.body.userName });
    query.findOne( (err, user) => {
        if (err) {
            handleError(res, err)
        } else {
            if (user) {
                res.sendStatus(httpStatus.CONFLICT)
            } else {
                user = new User({
                    userName: req.body.userName,
                    password: req.body.password
                });
                user.save()
                    .then( savedUser => res.json(savedUser))
                    .catch( err => {
                        handleError(res, err);
                    });
            }
        }
    });
}

function logIn(req, res) {
    const query = User.where({ userName: req.body.userName, password: req.body.password });
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
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
}

export default { createIfNotExists, logIn };