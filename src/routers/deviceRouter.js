import express from 'express';
import expressJwt from 'express-jwt';
import config from '../config/index';
import validationController from '../controllers/validationController';
import deviceController from '../controllers/deviceController';

const router = express.Router();

router
    .route('*')
        .all(expressJwt({ secret: config.jwtSecret }));

router
    .route('/:name')
        .get(deviceController.getDeviceByName);

export default router;