import express from 'express';
import httpStatus from 'http-status';
import userRouter from './userRouter'
import measurementRouter from './measurementRouter';
import eventRouter from './eventRouter';

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.sendStatus(httpStatus.OK)
);

router.use('/user', userRouter);
router.use('/measurement', measurementRouter);
router.use('/event', eventRouter);

export default router;