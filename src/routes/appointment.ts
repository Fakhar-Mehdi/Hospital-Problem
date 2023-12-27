import { addAppointment, getAppointments, getUnpaidAppointments } from "controllers/appointment";
import express from "express";

const appointmentRouter = express.Router();

appointmentRouter.route("/").post(addAppointment);
appointmentRouter.route("/").get(getAppointments);
appointmentRouter.route("/unpaid").get(getUnpaidAppointments);

//TBS pay fee
export default appointmentRouter;
