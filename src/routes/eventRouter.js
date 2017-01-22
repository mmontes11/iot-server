import express from 'express';
import expressJwt from 'express-jwt';
import expressValidation from 'express-validation';
import paramValidation from '../validation/paramValidation';
import eventController from '../controllers/eventController';
import config from '../../config/env';

const router = express.Router();

router
    .route('/')
        .post(expressJwt({ secret: config.jwtSecret }), expressValidation(paramValidation.createEvent),
            eventController.createEvent);

export default router;