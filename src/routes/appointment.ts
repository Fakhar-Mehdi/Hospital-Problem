import { addAppointment, getAllAppointment } from "controllers/appointment";
import express from "express";

const appointmentRouter = express.Router();

appointmentRouter.route("/").post(addAppointment);
appointmentRouter.route("/").get(getAllAppointment);
// appointmentRouter.route("/:pId?").get(getAppointmentsForPatient);

//pay fee
export default appointmentRouter;
