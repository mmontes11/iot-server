import express from 'express';
import userRouter from './userRouter'

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/user', userRouter);

export default router;