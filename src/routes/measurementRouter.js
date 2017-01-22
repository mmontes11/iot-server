import express from 'express';
import expressJwt from 'express-jwt';
import expressValidation from 'express-validation';
import paramValidation from '../validation/paramValidation';
import measurementController from '../controllers/measurementController';
import config from '../../config/env';

const router = express.Router();

router
    .route('/')
        .post(expressJwt({ secret: config.jwtSecret }), expressValidation(paramValidation.createMeasurement),
                measurementController.createMeasurement);

export default router;