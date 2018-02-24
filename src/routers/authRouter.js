import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import authController from '../controllers/authController';
import validationController from '../controllers/validationController';
import config from '../config/index';

const router = express.Router();

router
    .route('*')
        .all(expressBasicAuth({ users: config.basicAuthUsers}));

router
    .route('/user')
        .post(validationController.validateCreateUserIfNotExists, authController.createUserIfNotExists);

router
    .route('/token')
        .post(authController.getToken);

export default router;