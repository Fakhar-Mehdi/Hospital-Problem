"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_1 = require("controllers/appointment");
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("middleware/asyncHandler"));
const appointmentRouter = express_1.default.Router();
appointmentRouter
    .route("/")
    .post((0, asyncHandler_1.default)(appointment_1.addAppointment))
    .put((0, asyncHandler_1.default)(appointment_1.updateAppointment));
appointmentRouter.route("/").get((0, asyncHandler_1.default)(appointment_1.getAppointments));
appointmentRouter.route("/:_id").delete((0, asyncHandler_1.default)(appointment_1.deleteOneAppointment));
appointmentRouter.route("/unpaid").get((0, asyncHandler_1.default)(appointment_1.getUnpaidAppointments));
exports.default = appointmentRouter;
