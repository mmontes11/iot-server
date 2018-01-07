import express from 'express';
import expressJwt from 'express-jwt';
import config from '../config/index';
import validationController from '../controllers/validationController';
import observationsController from '../controllers/observationsController';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/')
        .post(validationController.validateCreateObservations, observationsController.createObservations);

export default router;