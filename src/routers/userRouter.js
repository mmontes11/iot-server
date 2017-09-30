import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import userController from '../controllers/userController';
import validationController from '../controllers/validationController';
import config from '../../config/index';

const router = express.Router();

router
    .route('/')
        .post(expressBasicAuth({ users: config.basicAuthUsers}), validationController.validateCreateUser, userController.createIfNotExists);

router
    .route('/logIn')
        .post(userController.logIn);

export default router;