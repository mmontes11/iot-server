import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import routes from "../routers/indexRouter";
import { logInfo } from "../utils/log";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  logInfo(`HTTP ${req.method} ${req.url} ${res.statusCode}`);
  next();
});

app.use("/", routes);

export default app;
