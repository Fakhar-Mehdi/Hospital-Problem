"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppProdReady = exports.throwForNoExistence = exports.checkExistence = exports.getAppointment = exports.getAppointmentsForDay = exports.getAppointmentsForPatient = exports.throwOnlyError = exports.validateAppointment = exports.sendAndLog = exports.logger = exports.getAll = exports.throwException = exports.validateObjectId = exports.validatePatient = void 0;
const yup_1 = require("yup");
const mongoose_1 = require("mongoose");
const enums_1 = require("helper/enums");
const lodash_1 = require("lodash");
const winston_1 = __importDefault(require("winston"));
const appointment_1 = __importDefault(require("models/appointment"));
const data_1 = require("data");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const validatePatient = async (patient) => {
    const patientSchema = (0, yup_1.object)({
        name: (0, yup_1.string)().required().trim().min(3).max(35),
        ownerName: (0, yup_1.string)().required().trim().min(3).max(35),
        ownerAddress: (0, yup_1.string)().required().trim().min(3).max(200),
        ownerPhone: (0, yup_1.string)().required().trim().min(11).max(15),
        noOfLegs: (0, yup_1.mixed)().oneOf(Object.values(enums_1.NO_OF_LEGS)).required(),
        currency: (0, yup_1.mixed)().oneOf(Object.values(enums_1.CURRENCY)),
    });
    return await patientSchema.validate(patient, { strict: true });
};
exports.validatePatient = validatePatient;
const validateObjectId = (res, id) => {
    (0, exports.throwForNoExistence)(res, id, "Input Not Found", 400);
    (0, exports.throwForNoExistence)(res, (0, mongoose_1.isValidObjectId)(id), "Invalid Input", 404);
    return true;
};
exports.validateObjectId = validateObjectId;
const throwException = (res, message, code) => {
    res.status(code || data_1.SERVER.ERROR_CODE);
    throw new Error(message || data_1.SERVER.ERROR_MESSAGE);
};
exports.throwException = throwException;
const getAll = async (Class, res, name) => {
    const result = await Class.find();
    if ((0, lodash_1.isEmpty)(result))
        res.status(404).send((0, exports.logger)(`No ${name} Found`));
    else
        (0, exports.sendAndLog)(res, `Sent All ${result}`);
};
exports.getAll = getAll;
const logger = (message, type = "info") => {
    if (type === "info")
        winston_1.default.info(`Response Sent: ${message}`);
    else if (type === "error")
        winston_1.default.error(`Response Sent: ${message}`);
    return message;
};
exports.logger = logger;
const sendAndLog = (res, message) => {
    res.send((0, exports.logger)(message));
};
exports.sendAndLog = sendAndLog;
const validateAppointment = (res, appointment) => {
    const appointmentSchema = (0, yup_1.object)({
        startTime: (0, yup_1.number)().required().min(0).max(23),
        endTime: (0, yup_1.number)().required().min(1).max(24),
        description: (0, yup_1.string)().required().trim().min(3).max(35),
        fee: (0, yup_1.number)().min(0),
        patientId: (0, yup_1.string)().min(24).max(24),
        date: (0, yup_1.date)(),
        isFeePaid: (0, yup_1.boolean)(),
        currency: (0, yup_1.mixed)().oneOf(Object.values(enums_1.CURRENCY)),
    });
    res.status(400);
    (0, exports.throwOnlyError)(!(appointment.startTime >= appointment.endTime), "Appointment MUST be started before its ended");
    return appointmentSchema.validate(appointment, {
        strict: true,
    });
};
exports.validateAppointment = validateAppointment;
const throwOnlyError = (element, message) => {
    if (!(0, exports.checkExistence)(element))
        throw new Error(message || data_1.SERVER.ERROR_MESSAGE);
};
exports.throwOnlyError = throwOnlyError;
const getAppointmentsForPatient = async (res, patientId) => {
    const appointments = await appointment_1.default.find({ patientId }).select({
        _id: 0,
        patientId: 0,
    });
    if ((0, lodash_1.isEmpty)(appointments))
        res.status(404).send((0, exports.logger)("No Appointments Found"));
    else
        (0, exports.sendAndLog)(res, `Got this\n${appointments}`);
};
exports.getAppointmentsForPatient = getAppointmentsForPatient;
const getAppointmentsForDay = async (res, date) => {
    const appointments = await appointment_1.default.find({ date });
    (0, lodash_1.isEmpty)(appointments)
        ? res.status(404).send((0, exports.logger)(`No Appointments found for day: ${date}`))
        : (0, exports.sendAndLog)(res, `Got ${appointments}`);
};
exports.getAppointmentsForDay = getAppointmentsForDay;
const getAppointment = async (res, _id) => {
    const appointment = await appointment_1.default.findById({ _id });
    (0, lodash_1.isEmpty)(appointment)
        ? res.status(404).send((0, exports.logger)(`No Appointment found for this id: ${_id}`))
        : (0, exports.sendAndLog)(res, `Got ${appointment}`);
};
exports.getAppointment = getAppointment;
const checkExistence = (element) => Array.isArray(element) ? element.length > 0 : !!element;
exports.checkExistence = checkExistence;
const throwForNoExistence = (res, data, message, code) => {
    if (!(0, exports.checkExistence)(data))
        (0, exports.throwException)(res, message || data_1.SERVER.ERROR_MESSAGE, code || data_1.SERVER.ERROR_CODE);
    return;
};
exports.throwForNoExistence = throwForNoExistence;
const makeAppProdReady = (app) => {
    app.use((0, helmet_1.default)());
    app.use(compression_1.default);
};
exports.makeAppProdReady = makeAppProdReady;
