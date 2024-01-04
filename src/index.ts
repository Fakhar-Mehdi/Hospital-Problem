import express from "express";
import dotenv from "dotenv";
import connectAndListen from "services/db";
import configureLogger from "services/logger";
import error from "middleware/error";
import patientRouter from "routes/patient";
import appointmentRouter from "routes/appointment";
import hospitalRouter from "routes/hospital";
import { ROUTES } from "helper/enums";
import { makeAppProdReady } from "./helper";
// import winston from "winston";
import { SERVER } from "data";
import homeRouter from "routes/home";

dotenv.config();

configureLogger();
const app = express();

app.use(express.json());
//all the routers
app.use(ROUTES.PATIENT_PATH, patientRouter);
app.use(ROUTES.APPOINTMENT_PATH, appointmentRouter);
app.use(ROUTES.HOSPITAL_PATH, hospitalRouter);
app.use(ROUTES.HOME_PATH, homeRouter);

makeAppProdReady(app);

//error middleware
app.use(error);

const server = connectAndListen(app);
// connectToMongoDb();
// const port = process.env.PORT || 3000;
// let server: any;

// server = app.listen(port, () =>
//   winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
// );

export default server;
