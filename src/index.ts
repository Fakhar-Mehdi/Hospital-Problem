import express from "express";
import dotenv from "dotenv";
import configureLogger from "services/logger";
import error from "middleware/error";
import patientRouter from "routes/patient";
import appointmentRouter from "routes/appointment";
import hospitalRouter from "routes/hospital";
import { ROUTES } from "helper/enums";
import { makeAppProdReady } from "./helper";

import homeRouter from "routes/home";
import { App } from "supertest/types";
import winston from "winston";
import mongoose from "mongoose";
import { DB } from "services/db/data";
import { SERVER } from "data";

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

// const server: App = connectAndListen(app);

if (!process.env.DB_CONNECTION_STRING) {
  winston.error("DB_CONNECTION_STRING is not set. Exiting...");
  process.exit(1);
}

let server = app.listen(0, () =>
  winston.info(`${SERVER.PORT_LISTEN_SUCCESS}0`)
);

mongoose
  .connect(process.env.DB_CONNECTION_STRING || "")
  .then((obj) => {
    winston.info(DB.SUCCESS_MESSAGE);
    const port = process.env.PORT || 3000;
    server = app.listen(port, () =>
      winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
    );
  })
  .catch((e) => {
    winston.error(`${DB.ERROR_MESSAGE}${e}`);
  });

export default server;
