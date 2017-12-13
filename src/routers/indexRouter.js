import express from 'express';
import httpStatus from 'http-status';
import userRouter from './userRouter'
import measurementRouter from './measurementRouter';
import eventRouter from './eventRouter';
import observationsRouter from './observationsRouter';
import devicesRouter from './devicesRouter';

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.sendStatus(httpStatus.OK)
);

router.use('/user', userRouter);
router.use('/measurement', measurementRouter);
router.use('/event', eventRouter);
router.use('/observations', observationsRouter);
router.use('/devices', devicesRouter);

export default router;