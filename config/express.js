import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../src/routes/indexRouter';
import config from './env';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(cors());
app.use(helmet());

app.use('/api', routes);

app.use((err, req, res, next) =>
    res.status(err.status).json({
        message: err.message,
        stack: config.env === 'development' ? err.stack : {}
    })
);

export default app;
