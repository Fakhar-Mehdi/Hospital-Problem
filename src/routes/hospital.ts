import { getMonthlyDetails, getMostPopularPet, getWeeklyDetails } from "controllers/hospital";
import express from "express";
import asyncHandler from "middleware/asyncHandler";

const hospitalRouter = express.Router();

hospitalRouter.route("/weekly").get(asyncHandler(getWeeklyDetails));
hospitalRouter.route("/monthly").get(asyncHandler(getMonthlyDetails));
hospitalRouter.route("/popular").get(asyncHandler(getMostPopularPet));

export default hospitalRouter;
