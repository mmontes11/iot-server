import express from 'express';
import expressJwt from 'express-jwt';
import config from '../config/index';
import validationController from '../controllers/validationController';
import subscriptionController from '../controllers/subscriptionController';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/')
        .post(validationController.validateSubscription, subscriptionController.createSubscription)
        .delete(validationController.validateSubscription, subscriptionController.deleteSubscription);

export default router;