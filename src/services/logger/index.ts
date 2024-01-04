import winston from "winston";
import w from "winston-mongodb";
import {
  exceptionsLogFileName,
  logFileName,
  rejectionsFogFileName,
} from "services/logger/data";
import { getConnectionString } from "helper/index";

const configureLogger = () => {
  winston.configure({
    transports: [
      new w.MongoDB({ db: getConnectionString() }),
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
      new winston.transports.File({
        filename: logFileName,
      }),
      new winston.transports.File({
        filename: exceptionsLogFileName,
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: rejectionsFogFileName,
        handleRejections: true,
      }),
    ],
  });
};

export default configureLogger;
