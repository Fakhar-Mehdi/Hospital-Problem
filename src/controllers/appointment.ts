import { Request, Response } from "express";
import {
  getAll,
  getAppointmentsForDay,
  getAppointmentsForPatient,
  logger,
  sendAndLog,
  throwException,
  throwForNoExistence,
  validateAppointment,
  validateObjectId,
} from "helper";
import { isEmpty } from "lodash";
import Appointment from "models/appointment";
import Patient from "models/patient";

export const addAppointment = async (req: Request, res: Response) => {
  //TBS check if the date is in Past?
  if (req.body.date) req.body.date = new Date(req.body.date);
  await validateAppointment(res, req.body);
  res.status(200);

  //get patient and do updates
  const patient: any = await Patient.findById(req.body.pId);
  throwForNoExistence(res, patient, "No Patient Found against the pId", 404);
  req.body.currency = patient.currency;
  if (req.body.isFeePaid) patient.billPaid += req.body.fee;
  else patient.billRemaining += req.body.fee;
  patient.appointmentCount++;
  await patient.save();
  await validateAppointment(res, req.body);
  res.status(200);
  const appointment = new Appointment(req.body);
  await appointment.save();
  sendAndLog(res, `Created ${appointment}`);
};

export const getAppointments = async (req: Request, res: Response) => {
  if (req.query.pId) return await getAppointmentsForPatient(res, req.query.pId);
  else if (req.query.day)
    return await getAppointmentsForDay(res, new Date(req.query.day as string));
  else await getAll(Appointment, res, "Appointments");
};

export const getUnpaidAppointments = async (req: Request, res: Response) => {
  const unpaidAppointments = await Appointment.find({ fee: 0 }).select({
    _id: 0,
    pId: 0,
  });
  isEmpty(unpaidAppointments)
    ? res.status(404).send(logger(`No Unpaid Appointments found`))
    : sendAndLog(res, `Got ${unpaidAppointments}`);
};

export const deleteOneAppointment = async (req: Request, res: Response) => {
  const { _id } = req.params;
  // if (!_id) throwException(res, "Id Not Found", 400);
  throwForNoExistence(res, _id, "Id Not Found", 400);

  validateObjectId(res, _id);
  let appointment: any = await Appointment.findById(_id);

  // if (!appointment) throwException(res);
  throwForNoExistence(res, appointment);
  throwForNoExistence(
    res,
    !appointment.isFeePaid,
    "The fee is paid and the appointment will remain in our Database for record keeping purposes",
    403
  );

  const patient = await Patient.findById(appointment.pId);
  if (patient) {
    patient.billRemaining = patient?.billRemaining - appointment.fee;
    patient.appointmentCount--;
    await patient.save();
  }
  //delete appointment
  // appointment = await Appointment.findByIdAndDelete(_id);
  await appointment.remove();

  sendAndLog(res, `Deleted ${appointment}`);
};

export const updateAppointment = async (req: Request, res: Response) => {
  const { _id, isFeePaid, pId, sTime, eTime, desc, fee, date } = req.body;
  throwForNoExistence(res, _id, "Id Not Found", 400);
  // if (!_id) throwException(res, "Id Not Found", 400);
  validateObjectId(res, _id);
  const appointment: any = await Appointment.findById(_id);
  // if (!appointment) throwException(res, "Appointment Not Found", 404);
  throwForNoExistence(res, appointment, "Appointment Not Found", 404);

  if (pId) {
    validateObjectId(res, pId);
    throwForNoExistence(
      res,
      !appointment.isFeePaid,
      "Cannot transfer the appointment as the Fee is Paid. Create a new Appointment for the other patient.",
      403
    );
    let patient = await Patient.findById(pId);
    // if (!patient) throwException(res, "No Patient Found", 404);
    throwForNoExistence(res, patient, "Patient Not Found", 404);

    if (patient) {
      if (isFeePaid) patient.billPaid = patient?.billPaid + fee;
      else patient.billRemaining = patient?.billRemaining + fee;
      patient.appointmentCount++;
      appointment.currency = patient.currency;
      await patient.save();
    }
    //old pid - data remove
    patient = await Patient.findById(appointment.pId);
    if (patient) {
      patient.billRemaining = patient?.billRemaining - appointment.fee;
      patient.appointmentCount--;
      await patient.save();
    }
    appointment.pId = pId;
    //DO THIS IN THIS APPOINTMENT
    //delete this appointment
    //create new appointment
  } else if (
    typeof isFeePaid === "boolean" &&
    !isFeePaid &&
    appointment.isFeePaid
  )
    throwException(res, "Cannot Refund the Fee");
  else if (
    typeof isFeePaid === "boolean" &&
    isFeePaid &&
    !appointment.isFeePaid
  ) {
    const patient = await Patient.findById(appointment.pId);
    if (patient) {
      patient.billRemaining = patient?.billRemaining - appointment.fee;
      patient.billPaid = patient?.billPaid - (fee || appointment.fee);
      await patient.save();
      appointment.isFeePaid = true;
    }
  }

  appointment.sTime = sTime || appointment.sTime;
  appointment.eTime = eTime || appointment.eTime;
  appointment.desc = desc || appointment.desc;
  appointment.fee = fee || appointment.fee;
  appointment.date = new Date(date) || appointment.date;

  await validateAppointment(res, appointment);
  res.status(200);
  await appointment.save();
};
