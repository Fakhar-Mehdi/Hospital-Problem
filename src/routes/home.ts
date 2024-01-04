import { homeEndPoint } from "controllers/home";
import express from "express";
import asyncHandler from "middleware/asyncHandler";

const homeRouter = express.Router();

homeRouter.route("/").get(asyncHandler(homeEndPoint));

export default homeRouter;
