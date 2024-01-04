import { Request, Response } from "express";
import {
  getAll,
  sendAndLog,
  throwException,
  throwForNoExistence,
  validateObjectId,
  validatePatient,
} from "helper";
import Appointment from "models/appointment";
import Patient from "models/patient";

export const getOneField = async (req: Request, res: Response) => {
  const { _id, field } = req.params;
  validateObjectId(res, _id);
  const result: any = await Patient.findById(_id);
  throwForNoExistence(res, result, "Invalid Id", 400);
  throwForNoExistence(res, result[field], "Invalid field", 400);
  // if (!result) throwException(res, "Invalid Id", 400);
  // if (!result[field]) throwException(res, "Invalid field", 400);
  sendAndLog(
    res,
    `${field} for Id: ${_id} and Name: ${result.name} is:\n${result[field]}`
  );
};

export const addPatient = async (req: Request, res: Response) => {
  const { billPaid, billRemaining, appointmentCount } = req.body;
  throwForNoExistence(
    res,
    !(billPaid || billRemaining || appointmentCount),
    "You cannot define billPaid, billRemaining, or appointmentCount\nPlease try again without entering them",
    403
  );
  const result = await validatePatient(req.body);
  // if (!result) throwException(res, "Invalid Input", 400);
  throwForNoExistence(res, result, "Invalid Input", 400);

  const patient = new Patient(result);
  const saved = await patient.save();
  sendAndLog(res, `New Patient Created ${saved}`);
};

export const getAllPatients = async (req: Request, res: Response) => {
  await getAll(Patient, res, "Patient");
};
export const getPatientDetails = async (req: Request, res: Response) => {
  const patients = await Patient.find().select({
    _id: 0,
    __v: 0,
    noOfLegs: 0,
    ownerName: 0,
    ownerAddress: 0,
    ownerPhone: 0,
  });

  throwForNoExistence(res, patients);
  res.send(patients);
};

export const getTotalBalance = async (req: Request, res: Response) => {
  const allPaidBills = await Patient.find().select({ billPaid: 1, _id: 0 });

  const sum = allPaidBills.reduce((total, element) => {
    return total + element.billPaid;
  }, 0);
  sendAndLog(res, `Total Balance of hospital is: ${sum}`);
};

export const getTotalDues = async (req: Request, res: Response) => {
  const allRemainingBills = await Patient.find().select({
    billRemaining: 1,
    _id: 0,
  });

  const sum = allRemainingBills.reduce((total, element) => {
    return total + element.billRemaining;
  }, 0);
  sendAndLog(res, `Total Dues of hospital is: ${sum}`);
};

export const deleteOnePatient = async (req: Request, res: Response) => {
  const { _id } = req.params;
  validateObjectId(res, _id);
  const patient = await Patient.findByIdAndDelete(_id);
  // if (!patient) throwException(res, "Patient Not Found", 404);
  throwForNoExistence(res, patient, "Patient Not Found", 404);

  //Delete Corresponding Appointments as well
  const delAppointments = await Appointment.deleteMany({ pId: _id });
  if (!delAppointments) throwException(res);
  throwForNoExistence(res, delAppointments);

  sendAndLog(
    res,
    `Deleted this ${patient}\nand also deleted the appointments\n${JSON.stringify(
      delAppointments
    )}`
  );
};

export const getPatientById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  validateObjectId(res, _id);
  const patient = await Patient.findById(_id);
  // if (!patient) throwException(res, "Patient Not Found", 404);
  throwForNoExistence(res, patient, "Patient Not Found", 404);

  sendAndLog(res, `Got this ${patient}`);
};

export const updatePatientDetails = async (req: Request, res: Response) => {
  const { billPaid, billRemaining, appointmentCount, currency } = req.body;
  // if (billPaid || billRemaining || appointmentCount)
  //   throwException(
  //     res,
  //     "Cannot update billPaid, appointmentCount and billRemaining. Please Try updating without either of them"
  //   );
  throwForNoExistence(
    res,
    !(billPaid || billRemaining || appointmentCount || currency),
    "Cannot update billPaid, currency, appointmentCount and billRemaining. Please Try updating without either of them",
    403
  );

  const { _id } = req.params;
  validateObjectId(res, _id);
  const p: any = await Patient.findById(_id);
  // if (!p) throwException(res, "Patient  not Found", 404);
  throwForNoExistence(res, p, "Patient Not Found", 404);

  const { name, noOfLegs, ownerName, ownerAddress, ownerPhone } = req.body;

  p.name = name || p.name;
  p.noOfLegs = noOfLegs || p.noOfLegs;
  p.ownerName = ownerName || p.ownerName;
  p.ownerAddress = ownerAddress || p.ownerAddress;
  p.ownerPhone = ownerPhone || p.ownerPhone;
  p.currency = currency || p.currency;
  // if (!(await validatePatient(p))) throwException(res, "Invalid Data", 400);
  throwForNoExistence(res, await validatePatient(p), "Invalid Data", 400);

  await p.save();
  sendAndLog(res, `Updated the Patient: ${p}`);
};
