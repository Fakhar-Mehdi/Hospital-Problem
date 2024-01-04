"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hospital_1 = require("controllers/hospital");
const patient_1 = require("controllers/patient");
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("middleware/asyncHandler"));
const hospitalRouter = express_1.default.Router();
hospitalRouter.route("/weekly").get((0, asyncHandler_1.default)(hospital_1.getWeeklyDetails));
hospitalRouter.route("/monthly").get((0, asyncHandler_1.default)(hospital_1.getMonthlyDetails));
hospitalRouter.route("/popular").get((0, asyncHandler_1.default)(hospital_1.getMostPopularPet));
hospitalRouter.route("/balance").get((0, asyncHandler_1.default)(patient_1.getTotalBalance));
exports.default = hospitalRouter;
