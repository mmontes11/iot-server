import express from 'express';
import expressJwt from 'express-jwt';
import expressValidation from 'express-validation';
import paramValidation from '../validation/paramValidation';
import customValidation from '../validation/customValidation';
import measurementController from '../controllers/measurementController';
import config from '../../config/index';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/')
        .post(expressValidation(paramValidation.createMeasurement), measurementController.createMeasurement);

router
    .route('/types')
        .get(measurementController.getTypes);

router
    .route('/last')
        .get(measurementController.getLastMeasurement);

router
    .route('/:type/last')
        .get(measurementController.getLastMeasurement);

router
    .route('/stats')
        .get(customValidation.validateGetStats, measurementController.getStats);

router
    .route('/:type/stats')
        .get(customValidation.validateGetStats, measurementController.getStats);

export default router;