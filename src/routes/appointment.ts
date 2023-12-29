import {
  addAppointment,
  deleteOneAppointment,
  getAppointments,
  getUnpaidAppointments,
  updateAppointment,
} from "controllers/appointment";
import express from "express";
import asyncHandler from "middleware/asyncHandler";

const appointmentRouter = express.Router();

appointmentRouter
  .route("/")
  .post(asyncHandler(addAppointment))
  .put(asyncHandler(updateAppointment));
appointmentRouter.route("/").get(asyncHandler(getAppointments));
appointmentRouter.route("/:_id").delete(asyncHandler(deleteOneAppointment));
appointmentRouter.route("/unpaid").get(asyncHandler(getUnpaidAppointments));

//TBS pay fee
export default appointmentRouter;
