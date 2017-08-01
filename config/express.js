import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import winston from './winston';
import expressWinston from 'express-winston';
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

if (config.debug) {
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console({
                timestamp: true,
                json: false,
                colorize: true
            }),
            new winston.transports.File({
                timestamp: true,
                json: false,
                colorize: true,
                filename: 'log_iot_express.log'
            }),
            new winston.transports.MongoDB({
                timestamp: true,
                json: true,
                colorize: true,
                db: config.mongoUrl,
                collection: 'log_iot_express'
            })
        ],
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        colorize: true
    }));
}

app.use('/api', routes);

export default app;
