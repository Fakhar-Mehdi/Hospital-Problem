import { Request, Response } from "express";
import {
  getAll,
  getAppointmentsForPatient,
  logger,
  sendAndLog,
  throwException,
  validateAppointment,
} from "helper";
import { isEmpty } from "lodash";
import asyncHandler from "middleware/asyncHandler";
import Appointment from "models/appointment";

export const addAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    //check if the date is in Past?
    if (req.body.date) req.body.date = new Date(req.body.date);
    if (!(await validateAppointment(req.body)))
      throwException(res, "Invalid Data", 400);
    const appointment = new Appointment(req.body);
    await appointment.save();
    sendAndLog(res, `Created ${appointment}`);
    // const { sTime, eTime, desc, fee, pId, date, isFeePaid } = req.body;
  }
);

export const getAllAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.query.pId) getAppointmentsForPatient(res, req.query.pId);
    await getAll(Appointment, res, "Appointments");
  }
);
