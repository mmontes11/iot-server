import express from 'express';
import httpStatus from 'http-status';
import userRouter from './userRouter'
import measurementRouter from './measurementRouter';

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.sendStatus(httpStatus.OK)
);

router.use('/user', userRouter);
router.use('/measurement', measurementRouter);

export default router;