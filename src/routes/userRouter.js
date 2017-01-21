import express from 'express';
import expressValidation from 'express-validation';
import paramValidation from '../validation/paramValidation';
import userController from '../controllers/userController'

const router = express.Router();

router.route('/')
    .post(expressValidation(paramValidation.createUser), userController.save);

export default router;
