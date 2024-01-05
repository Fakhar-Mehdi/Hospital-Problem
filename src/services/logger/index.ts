import winston from "winston";
import w from "winston-mongodb";
import {
  exceptionsLogFileName,
  logFileName,
  rejectionsFogFileName,
} from "services/logger/data";

const configureLogger = () => {
  winston.configure({
    transports: [
      new w.MongoDB({ db: process.env.DB_CONNECTION_STRING || "" }),
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
