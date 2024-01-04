"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_mongodb_1 = __importDefault(require("winston-mongodb"));
const data_1 = require("services/logger/data");
const data_2 = require("services/db/data");
const configureLogger = () => {
    winston_1.default.configure({
        transports: [
            new winston_mongodb_1.default.MongoDB({ db: data_2.DB.CONNECTION_STRING }),
            new winston_1.default.transports.Console({
                handleExceptions: true,
                handleRejections: true,
            }),
            new winston_1.default.transports.File({
                filename: data_1.logFileName,
            }),
            new winston_1.default.transports.File({
                filename: data_1.exceptionsLogFileName,
                handleExceptions: true,
            }),
            new winston_1.default.transports.File({
                filename: data_1.rejectionsFogFileName,
                handleRejections: true,
            }),
        ],
    });
};
exports.default = configureLogger;
