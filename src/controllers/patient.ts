import { Request, Response } from "express";
import {
  getAll,
  sendAndLog,
  throwException,
  validateObjectId,
  validatePatient,
} from "helper";
import asyncHandler from "middleware/asyncHandler";
import Patient from "models/patient";


export const getOneField = asyncHandler(async (req: Request, res: Response) => {
  const { _id, field } = req.params;
  if (!(await validateObjectId(_id))) throwException(res, "Invalid Id", 400);
  const result: any = await Patient.findById(_id);
  if (!result) throwException(res, "Invalid Id", 400);
  if (!result[field]) throwException(res, "Invalid field", 400);
  sendAndLog(
    res,
    `${field} for\nId: ${_id} and Name: ${result.name} is:\n${result[field]}`
  );
});

export const addPatient = asyncHandler(async (req: Request, res: Response) => {
  const result = await validatePatient(req.body);
  if (!result) throwException(res, "Invalid Input", 400);
  const patient = new Patient(result);
  const saved = await patient.save();
  sendAndLog(res, `New Patient Added ${saved}`);
});

export const getAllPatients = asyncHandler(
  async (req: Request, res: Response) => {
    await getAll(Patient, res, "Patient");
  }
);

export const getTotalBalance = asyncHandler(
  async (req: Request, res: Response) => {
    const allPaidBills = await Patient.find().select({ billPaid: 1, _id: 0 });

    const sum = allPaidBills.reduce((total, element) => {
      return total + element.billPaid;
    }, 0);
    sendAndLog(res, `Total Balance of hospital is: ${sum}`);
  }
);

export const getTotalDues = asyncHandler(
  async (req: Request, res: Response) => {
    const allRemainingBills = await Patient.find().select({
      billRemaining: 1,
      _id: 0,
    });

    const sum = allRemainingBills.reduce((total, element) => {
      return total + element.billRemaining;
    }, 0);
    sendAndLog(res, `Total Dues of hospital is: ${sum}`);
  }
);
export const deleteOnePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;
    if (!(await validateObjectId(_id))) throwException(res, "Invalid Id", 400);
    const patient = await Patient.findByIdAndDelete(_id);
    if (!patient) throwException(res, "Patient Not Found", 404);
    //Delete Corresponding Appointments as well
    sendAndLog(res, `Deleted this ${patient}`);
  }
);

export const getPatientById = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;
    if (!(await validateObjectId(_id))) throwException(res, "Invalid Id", 400);
    const patient = await Patient.findById(_id);
    if (!patient) throwException(res, "Patient Not Found", 404);
    sendAndLog(res, `Got this ${patient}`);
  }
);

export const updatePatientDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { billPaid, billRemaining } = req.body;
    if (billPaid || billRemaining)
      throwException(
        res,
        "Cannot update billPaid and billRemaining. Please Try updating without them"
      );
    const { _id } = req.params;
    if (!(await validateObjectId(_id))) throwException(res, "Invalid Id", 400);
    const p: any = await Patient.findById(_id);
    if (!p) throwException(res, "Patient  not Found", 404);
    const { name, noOfLegs, ownerName, ownerAddress, ownerPhone } = req.body;

    p.name = name || p.name;
    p.noOfLegs = noOfLegs || p.noOfLegs;
    p.ownerName = ownerName || p.ownerName;
    p.ownerAddress = ownerAddress || p.ownerAddress;
    p.ownerPhone = ownerPhone || p.ownerPhone;
    if (!(await validatePatient(p))) throwException(res, "Invalid Data", 400);
    await p.save();
    sendAndLog(res, `Updated the Patient: ${p}`);
  }
);
