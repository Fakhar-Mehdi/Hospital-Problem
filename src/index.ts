import express from "express";
import dotenv from "dotenv";
import connectAndListen from "services/db";
import configureLogger from "services/logger";
import error from "middleware/error";
import patientRouter from "routes/patient";
import appointmentRouter from "routes/appointment";
import hospitalRouter from "routes/hospital";
import { ROUTES } from "helper/enums";

configureLogger();
dotenv.config();
const app = express();

app.use(express.json());
//all the routers
app.use(ROUTES.PATIENT_PATH, patientRouter);
app.use(ROUTES.APPOINTMENT_PATH, appointmentRouter);
app.use(ROUTES.HOSPITAL_PATH, hospitalRouter);

//error middleware
app.use(error);

const server = connectAndListen(app);

export default server;
