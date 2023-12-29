import { getMonthlyDetails, getWeeklyDetails } from "controllers/hospital";
import express from "express";
import asyncHandler from "middleware/asyncHandler";

const hospitalRouter = express.Router();

hospitalRouter.route("/weekly").get(asyncHandler(getWeeklyDetails));
hospitalRouter.route("/monthly").get(asyncHandler(getMonthlyDetails));

export default hospitalRouter;
