import { Request, Response } from "express";
import {
  getAll,
  getAppointmentsForDay,
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
    //TBS check if the date is in Past?
    if (req.body.date) req.body.date = new Date(req.body.date);
    if (!(await validateAppointment(req.body)))
      throwException(res, "Invalid Data", 400);
    const appointment = new Appointment(req.body);
    await appointment.save();
    sendAndLog(res, `Created ${appointment}`);
  }
);

export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.query.pId)
      return await getAppointmentsForPatient(res, req.query.pId);
    else if (req.query.day)
      return await getAppointmentsForDay(
        res,
        new Date(req.query.day as string)
      );
    else await getAll(Appointment, res, "Appointments");
  }
);

export const getUnpaidAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const unpaidAppointments = await Appointment.find({ fee: 0 }).select({
      _id: 0,
      pId: 0,
    });
    isEmpty(unpaidAppointments)
      ? res.status(404).send(logger(`No Unpaid Appointments found`))
      : sendAndLog(res, `Got ${unpaidAppointments}`);
  }
);
