"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("winston"));
const data_1 = require("services/db/data");
const data_2 = require("data");
const connectToMongoDb = async () => {
    try {
        await mongoose_1.default.connect(data_1.DB.CONNECTION_STRING);
        winston_1.default.info(data_1.DB.SUCCESS_MESSAGE);
    }
    catch (e) {
        winston_1.default.error(`${data_1.DB.ERROR_MESSAGE}${e}`);
    }
};
exports.connectToMongoDb = connectToMongoDb;
const connectAndListen = async (app) => {
    await (0, exports.connectToMongoDb)();
    const port = 5000;
    return app.listen(port, () => winston_1.default.info(`${data_2.SERVER.PORT_LISTEN_SUCCESS}${port}`));
};
exports.default = connectAndListen;
