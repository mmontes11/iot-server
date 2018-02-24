import express from 'express';
import httpStatus from 'http-status';
import authRouter from './authRouter'
import measurementRouter from './measurementRouter';
import eventRouter from './eventRouter';
import observationsRouter from './observationsRouter';
import thingRouter from './thingRouter';
import thingsRouter from './thingsRouter';
import timePeriodsRouter from './timePeriodsRouter';

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.sendStatus(httpStatus.OK)
);

router.use('/auth', authRouter);
router.use('/measurement', measurementRouter);
router.use('/event', eventRouter);
router.use('/observations', observationsRouter);
router.use('/thing', thingRouter);
router.use('/things', thingsRouter);
router.use('/timePeriods', timePeriodsRouter);

export default router;