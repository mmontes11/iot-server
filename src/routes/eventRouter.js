import express from 'express';
import expressJwt from 'express-jwt';
import eventController from '../controllers/eventController';
import validationController from '../controllers/validationController';
import config from '../../config/index';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/')
        .post(validationController.validateCreateEvent, eventController.createEvent);

router
    .route('/types')
        .get(eventController.getTypes);

router
    .route('/last')
        .get(eventController.getLastEvent);

router
    .route('/:type/last')
        .get(eventController.getLastEvent);

export default router;