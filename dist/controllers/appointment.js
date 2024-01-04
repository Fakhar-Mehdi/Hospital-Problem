"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointment = exports.deleteOneAppointment = exports.getUnpaidAppointments = exports.getAppointments = exports.addAppointment = void 0;
const helper_1 = require("helper");
const lodash_1 = require("lodash");
const appointment_1 = __importDefault(require("models/appointment"));
const patient_1 = __importDefault(require("models/patient"));
const addAppointment = async (req, res) => {
    if (req.body.date)
        req.body.date = new Date(req.body.date);
    await (0, helper_1.validateAppointment)(res, req.body);
    res.status(200);
    const patient = await patient_1.default.findById(req.body.pId);
    (0, helper_1.throwForNoExistence)(res, patient, "No Patient Found against the pId", 404);
    req.body.currency = patient.currency;
    if (req.body.isFeePaid)
        patient.billPaid = req.body.fee + (patient.billPaid || 0);
    else
        patient.billRemaining = req.body.fee + (patient.billRemaining || 0);
    patient.appointmentCount = 1 + (patient.appointmentCount || 0);
    await patient.save();
    await (0, helper_1.validateAppointment)(res, req.body);
    res.status(200);
    const appointment = new appointment_1.default(req.body);
    await appointment.save();
    (0, helper_1.sendAndLog)(res, `Created ${appointment}`);
};
exports.addAppointment = addAppointment;
const getAppointments = async (req, res) => {
    if (req.query.pId)
        return await (0, helper_1.getAppointmentsForPatient)(res, req.query.pId);
    else if (req.query.day)
        return await (0, helper_1.getAppointmentsForDay)(res, new Date(req.query.day));
    else if (req.query._id)
        return await (0, helper_1.getAppointment)(res, req.query._id);
    else
        await (0, helper_1.getAll)(appointment_1.default, res, "Appointments");
};
exports.getAppointments = getAppointments;
const getUnpaidAppointments = async (req, res) => {
    const unpaidAppointments = await appointment_1.default.find({ fee: 0 }).select({
        _id: 0,
        pId: 0,
    });
    (0, lodash_1.isEmpty)(unpaidAppointments)
        ? res.status(404).send((0, helper_1.logger)(`No Unpaid Appointments found`))
        : (0, helper_1.sendAndLog)(res, `Got ${unpaidAppointments}`);
};
exports.getUnpaidAppointments = getUnpaidAppointments;
const deleteOneAppointment = async (req, res) => {
    const { _id } = req.params;
    (0, helper_1.throwForNoExistence)(res, _id, "Id Not Found", 400);
    (0, helper_1.validateObjectId)(res, _id);
    let appointment = await appointment_1.default.findById(_id);
    (0, helper_1.throwForNoExistence)(res, appointment);
    (0, helper_1.throwForNoExistence)(res, !appointment.isFeePaid, "The fee is paid and the appointment will remain in our Database for record keeping purposes", 403);
    const patient = await patient_1.default.findById(appointment.pId);
    if (patient) {
        patient.billRemaining = patient?.billRemaining - appointment.fee;
        patient.appointmentCount--;
        await patient.save();
    }
    appointment = await appointment_1.default.findByIdAndDelete(_id);
    (0, helper_1.sendAndLog)(res, `Deleted ${appointment}`);
};
exports.deleteOneAppointment = deleteOneAppointment;
const updateAppointment = async (req, res) => {
    const { _id, isFeePaid, pId, sTime, eTime, desc, fee, date } = req.body;
    (0, helper_1.throwForNoExistence)(res, _id, "Id Not Found", 400);
    (0, helper_1.validateObjectId)(res, _id);
    const appointment = await appointment_1.default.findById(_id);
    (0, helper_1.throwForNoExistence)(res, appointment, "Appointment Not Found", 404);
    if (pId && appointment.pId.toString() !== pId) {
        (0, helper_1.validateObjectId)(res, pId);
        (0, helper_1.throwForNoExistence)(res, !appointment.isFeePaid, "Cannot transfer the appointment as the Fee is Paid. Create a new Appointment for the other patient.", 403);
        let patient = await patient_1.default.findById(pId);
        (0, helper_1.throwForNoExistence)(res, patient, "Patient Not Found", 404);
        if (patient) {
            if (isFeePaid)
                patient.billPaid = patient?.billPaid + fee || appointment.fee;
            else
                patient.billRemaining = patient?.billRemaining + fee || appointment.fee;
            patient.appointmentCount++;
            appointment.currency = patient.currency;
            await patient.save();
        }
        patient = await patient_1.default.findById(appointment.pId);
        if (patient) {
            patient.billRemaining = patient?.billRemaining - appointment.fee;
            patient.appointmentCount = -1 + patient.appointmentCount;
            await patient.save();
        }
        appointment.pId = pId;
    }
    else if (typeof isFeePaid === "boolean" &&
        !isFeePaid &&
        !fee &&
        appointment.isFeePaid)
        (0, helper_1.throwException)(res, "Cannot Refund the Fee");
    else if (typeof isFeePaid === "boolean" &&
        isFeePaid &&
        !fee &&
        !appointment.isFeePaid) {
        const patient = await patient_1.default.findById(appointment.pId);
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
    appointment.isFeePaid = isFeePaid || false;
    appointment.date = new Date(date) || appointment.date;
    await (0, helper_1.validateAppointment)(res, appointment);
    res.status(200);
    await appointment.save();
    (0, helper_1.sendAndLog)(res, `Updated: ${appointment}`);
};
exports.updateAppointment = updateAppointment;
