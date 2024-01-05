"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("services/logger"));
const error_1 = __importDefault(require("middleware/error"));
const patient_1 = __importDefault(require("routes/patient"));
const appointment_1 = __importDefault(require("routes/appointment"));
const hospital_1 = __importDefault(require("routes/hospital"));
const enums_1 = require("helper/enums");
const helper_1 = require("./helper");
const home_1 = __importDefault(require("routes/home"));
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = __importDefault(require("mongoose"));
const data_1 = require("services/db/data");
const data_2 = require("data");
dotenv_1.default.config();
(0, logger_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(enums_1.ROUTES.PATIENT_PATH, patient_1.default);
app.use(enums_1.ROUTES.APPOINTMENT_PATH, appointment_1.default);
app.use(enums_1.ROUTES.HOSPITAL_PATH, hospital_1.default);
app.use(enums_1.ROUTES.HOME_PATH, home_1.default);
(0, helper_1.makeAppProdReady)(app);
app.use(error_1.default);
if (!process.env.DB_CONNECTION_STRING) {
    winston_1.default.error("DB_CONNECTION_STRING is not set. Exiting...");
    process.exit(1);
}
let server = app.listen(0, () => winston_1.default.info(`${data_2.SERVER.PORT_LISTEN_SUCCESS}0`));
mongoose_1.default
    .connect(process.env.DB_CONNECTION_STRING || "")
    .then((obj) => {
    winston_1.default.info(data_1.DB.SUCCESS_MESSAGE);
    const port = process.env.PORT || 3000;
    server = app.listen(port, () => winston_1.default.info(`${data_2.SERVER.PORT_LISTEN_SUCCESS}${port}`));
})
    .catch((e) => {
    winston_1.default.error(`${data_1.DB.ERROR_MESSAGE}${e}`);
});
exports.default = server;
