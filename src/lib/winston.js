import { createLogger, format, transports } from "winston";
import "winston-mongodb";
import config from "../config";

const loggerTransports = [
  new transports.Console(),
  new transports.File({
    filename: "log-iot-server.log",
  }),
];

if (config.storeLogsInMongo) {
  loggerTransports.push(
    new transports.MongoDB({
      timestamp: true,
      json: true,
      colorize: true,
      db: config.mongoUrl,
      collection: "log-iot-server",
      options: {
        useNewUrlParser: true,
      },
    }),
  );
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
  ),
  transports: loggerTransports,
});

export default logger;
