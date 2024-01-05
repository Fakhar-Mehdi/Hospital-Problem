"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientDetails = exports.getPatientById = exports.deleteOnePatient = exports.getTotalDues = exports.getTotalBalance = exports.getPatientDetails = exports.getAllPatients = exports.addPatient = exports.getOneField = void 0;
const helper_1 = require("helper");
const appointment_1 = __importDefault(require("models/appointment"));
const patient_1 = __importDefault(require("models/patient"));
const getOneField = async (req, res) => {
    const { _id, field } = req.params;
    (0, helper_1.validateObjectId)(res, _id);
    const result = await patient_1.default.findById(_id);
    (0, helper_1.throwForNoExistence)(res, result, "Invalid Id", 400);
    (0, helper_1.throwForNoExistence)(res, result[field], "Invalid field", 400);
    (0, helper_1.sendAndLog)(res, `${field} for Id: ${_id} and Name: ${result.name} is:\n${result[field]}`);
};
exports.getOneField = getOneField;
const addPatient = async (req, res) => {
    const { billPaid, billRemaining, appointmentCount } = req.body;
    (0, helper_1.throwForNoExistence)(res, !(billPaid || billRemaining || appointmentCount), "You cannot define billPaid, billRemaining, or appointmentCount\nPlease try again without entering them", 403);
    const result = await (0, helper_1.validatePatient)(req.body);
    (0, helper_1.throwForNoExistence)(res, result, "Invalid Input", 400);
    const patient = new patient_1.default(result);
    const saved = await patient.save();
    (0, helper_1.sendAndLog)(res, `New Patient Created ${saved}`);
};
exports.addPatient = addPatient;
const getAllPatients = async (req, res) => {
    await (0, helper_1.getAll)(patient_1.default, res, "Patient");
};
exports.getAllPatients = getAllPatients;
const getPatientDetails = async (req, res) => {
    const patients = await patient_1.default.find().select({
        _id: 0,
        __v: 0,
        noOfLegs: 0,
        ownerName: 0,
        ownerAddress: 0,
        ownerPhone: 0,
    });
    (0, helper_1.throwForNoExistence)(res, patients);
    res.send(patients);
};
exports.getPatientDetails = getPatientDetails;
const getTotalBalance = async (req, res) => {
    const allPaidBills = await patient_1.default.find().select({ billPaid: 1, _id: 0 });
    const sum = allPaidBills.reduce((total, element) => {
        return total + element.billPaid;
    }, 0);
    (0, helper_1.sendAndLog)(res, `Total Balance of hospital is: ${sum}`);
};
exports.getTotalBalance = getTotalBalance;
const getTotalDues = async (req, res) => {
    const allRemainingBills = await patient_1.default.find().select({
        billRemaining: 1,
        _id: 0,
    });
    const sum = allRemainingBills.reduce((total, element) => {
        return total + element.billRemaining;
    }, 0);
    (0, helper_1.sendAndLog)(res, `Total Dues of hospital is: ${sum}`);
};
exports.getTotalDues = getTotalDues;
const deleteOnePatient = async (req, res) => {
    const { _id } = req.params;
    (0, helper_1.validateObjectId)(res, _id);
    const patient = await patient_1.default.findByIdAndDelete(_id);
    (0, helper_1.throwForNoExistence)(res, patient, "Patient Not Found", 404);
    const delAppointments = await appointment_1.default.deleteMany({ patientId: _id });
    if (!delAppointments)
        (0, helper_1.throwException)(res);
    (0, helper_1.throwForNoExistence)(res, delAppointments);
    (0, helper_1.sendAndLog)(res, `Deleted this ${patient}\nand also deleted the appointments\n${JSON.stringify(delAppointments)}`);
};
exports.deleteOnePatient = deleteOnePatient;
const getPatientById = async (req, res) => {
    const { _id } = req.params;
    (0, helper_1.validateObjectId)(res, _id);
    const patient = await patient_1.default.findById(_id);
    (0, helper_1.throwForNoExistence)(res, patient, "Patient Not Found", 404);
    (0, helper_1.sendAndLog)(res, `Got this ${patient}`);
};
exports.getPatientById = getPatientById;
const updatePatientDetails = async (req, res) => {
    const { billPaid, billRemaining, appointmentCount, currency } = req.body;
    (0, helper_1.throwForNoExistence)(res, !(billPaid || billRemaining || appointmentCount || currency), "Cannot update billPaid, currency, appointmentCount and billRemaining. Please Try updating without either of them", 403);
    const { _id } = req.params;
    (0, helper_1.validateObjectId)(res, _id);
    const p = await patient_1.default.findById(_id);
    (0, helper_1.throwForNoExistence)(res, p, "Patient Not Found", 404);
    const { name, noOfLegs, ownerName, ownerAddress, ownerPhone } = req.body;
    p.name = name || p.name;
    p.noOfLegs = noOfLegs || p.noOfLegs;
    p.ownerName = ownerName || p.ownerName;
    p.ownerAddress = ownerAddress || p.ownerAddress;
    p.ownerPhone = ownerPhone || p.ownerPhone;
    p.currency = currency || p.currency;
    (0, helper_1.throwForNoExistence)(res, await (0, helper_1.validatePatient)(p), "Invalid Data", 400);
    await p.save();
    (0, helper_1.sendAndLog)(res, `Updated the Patient: ${p}`);
};
exports.updatePatientDetails = updatePatientDetails;
