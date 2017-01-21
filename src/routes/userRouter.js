import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import expressValidation from 'express-validation';
import paramValidation from '../validation/paramValidation';
import userController from '../controllers/userController';
import config from '../../config/env';

const router = express.Router();

router.route('/')
    .post(expressBasicAuth({ users: config.basicAuthUsers}), expressValidation(paramValidation.createUser), userController.createIfNotExists);

export default router;