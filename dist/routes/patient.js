"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_1 = require("controllers/patient");
const asyncHandler_1 = __importDefault(require("middleware/asyncHandler"));
const patientRouter = express_1.default.Router();
patientRouter.route("/:_id/:field").get((0, asyncHandler_1.default)(patient_1.getOneField));
patientRouter
    .route("/")
    .post((0, asyncHandler_1.default)(patient_1.addPatient))
    .get((0, asyncHandler_1.default)(patient_1.getAllPatients));
patientRouter.route("/dues").get((0, asyncHandler_1.default)(patient_1.getTotalDues));
patientRouter.route("/details").get((0, asyncHandler_1.default)(patient_1.getPatientDetails));
patientRouter
    .route("/:_id")
    .delete((0, asyncHandler_1.default)(patient_1.deleteOnePatient))
    .get((0, asyncHandler_1.default)(patient_1.getPatientById))
    .put((0, asyncHandler_1.default)(patient_1.updatePatientDetails));
exports.default = patientRouter;
