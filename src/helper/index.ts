import { object, string, number, date, mixed, boolean } from "yup";
import { isValidObjectId } from "mongoose";
import { Response } from "express";
import { NO_OF_LEGS } from "helper/enums";
import { isEmpty } from "lodash";
import winston from "winston";
import Appointment from "models/appointment";

export const validatePatient = async (patient: any) => {
  const patientSchema = object({
    name: string().required().trim().min(3).max(35),
    ownerName: string().required().trim().min(3).max(35),
    ownerAddress: string().required().trim().min(3).max(200),
    ownerPhone: string().required().trim().min(11).max(15),
    noOfLegs: mixed<NO_OF_LEGS>().oneOf(Object.values(NO_OF_LEGS)).required(),
    billPaid: number().min(0),
    billRemaining: number().min(0),
  });
  return await patientSchema.validate(patient, { strict: true });
};

export const validateObjectId = async (id: any) => {
  if (!id) throw new Error("Id not Found");
  return await isValidObjectId(id);
};

export const throwException = (
  res: Response,
  message: string = "Internal Server Error",
  code: number = 500
) => {
  res.status(code);
  throw new Error(message);
};

export const getAll = async (Class: any, res: Response, name: string) => {
  const result = await Class.find();
  if (isEmpty(result)) res.status(404).send(logger(`No ${name} Found`));
  else sendAndLog(res, `Sent All ${result}`);
};

export const logger = (message: string, type: string = "info") => {
  if (type === "info") winston.info(`Response Sent: ${message}`);
  else if (type === "error") winston.error(`Response Sent: ${message}`);
  return message;
};

export const sendAndLog = (res: Response, message: string) => {
  res.send(logger(message));
};

export const validateAppointment = async (appointment: any) => {
  const appointmentSchema = object({
    sTime: number().required().min(0).max(23),
    eTime: number().required().min(1).max(24),
    desc: string().required().trim().min(3).max(35),
    fee: number().min(0),
    pId: string().min(24).max(24),
    date: date(),
    isFeePaid: boolean(),
  });

  return (
    (await validateObjectId(appointment.pId)) &&
    (await appointmentSchema.validate(appointment), { strict: true })
  );
};

export const getAppointmentsForPatient = async (res: Response, pId: any) => {
  const appointments = await Appointment.find({ pId }).select({
    _id: 0,
    pId: 0,
  });
  if (isEmpty(appointments))
    res.status(404).send(logger("No Appointments Found"));
  else sendAndLog(res, `Got All\n${appointments}`);
};

export const getAppointmentsForDay = async (res: Response, date: Date) => {
  const appointments = await Appointment.find({ date }).select({
    _id: 0,
    pId: 0,
  });
  isEmpty(appointments)
    ? res.status(404).send(logger(`No Appointments found for day: ${date}`))
    : sendAndLog(res, `Got ${appointments}`);
};
