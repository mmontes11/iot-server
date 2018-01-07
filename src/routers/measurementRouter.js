import express from 'express';
import expressJwt from 'express-jwt';
import measurementController from '../controllers/measurementController';
import validationController from '../controllers/validationController';
import config from '../config/index';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/')
        .post(validationController.validateCreateMeasurement, measurementController.createMeasurement);

router
    .route('/types')
        .get(measurementController.getTypes);

router
    .route('/last')
        .get(measurementController.getLastMeasurement);

router
    .route('/stats')
        .get(validationController.validateMeasurementStats, measurementController.getStats);

export default router;