import {
  getMonthlyDetails,
  getMostPopularPet,
  getWeeklyDetails,
} from "controllers/hospital";
import { getTotalBalance } from "controllers/patient";
import express from "express";
import asyncHandler from "middleware/asyncHandler";

const hospitalRouter = express.Router();

hospitalRouter.route("/weekly").get(asyncHandler(getWeeklyDetails));
hospitalRouter.route("/monthly").get(asyncHandler(getMonthlyDetails));
hospitalRouter.route("/popular").get(asyncHandler(getMostPopularPet));
hospitalRouter.route("/balance").get(asyncHandler(getTotalBalance));

export default hospitalRouter;
