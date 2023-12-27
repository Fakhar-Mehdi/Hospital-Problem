import winston from "winston";
import w from "winston-mongodb";

const configureLogger = () => {
  winston.configure({
    transports: [ new w.MongoDB({db:"mongodb://localhost/hospital"}),
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
      new winston.transports.File({
        filename: "hospital.logger",
      }),
      new winston.transports.File({
        filename: "hospital-unhandledExceptions.logger",
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: "hospital-unhandledRejections.logger",
        handleRejections: true,
      }),
    ],
  });
};

export default configureLogger;
