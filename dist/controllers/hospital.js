"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostPopularPet = exports.getMonthlyDetails = exports.getWeeklyDetails = void 0;
const helper_1 = require("helper");
const appointment_1 = __importDefault(require("models/appointment"));
const patient_1 = __importDefault(require("models/patient"));
const getDaysBeforeDate = (days) => {
    return days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : new Date();
};
const getWeeklyDetails = async (req, res) => {
    getPreviousRecord(7, res);
};
exports.getWeeklyDetails = getWeeklyDetails;
const getMonthlyDetails = async (req, res) => {
    getPreviousRecord(30, res);
};
exports.getMonthlyDetails = getMonthlyDetails;
const getPreviousRecord = async (days, res) => {
    const daysAgo = getDaysBeforeDate(days);
    const appointments = await appointment_1.default.find({
        date: { $gte: daysAgo, $lte: new Date() },
    }).select({ fee: 1, isFeePaid: 1, currency: 1, _id: 0 });
    if (!(0, helper_1.checkExistence)(appointments)) {
        res.status(404);
        (0, helper_1.sendAndLog)(res, `No appointments in the past ${days} days`);
        return;
    }
    let balance = 0, unpaid = 0;
    appointments.forEach((a) => {
        let money = a.fee;
        if (a.currency === "BTC")
            money *= 43000;
        else if (a.currency === "EUR")
            money *= 1.11;
        if (a.isFeePaid)
            balance += money;
        else
            unpaid += money;
    });
    (0, helper_1.sendAndLog)(res, `Got ${appointments.length} Appointment in the last ${days} days\nBalance: ${balance}\nUnpaid: ${unpaid}`);
};
const getMostPopularPet = async (req, res) => {
    const popularPet = await patient_1.default.find()
        .sort({ appointmentCount: -1 })
        .limit(1)
        .select({
        __v: 0,
    });
    return (0, helper_1.checkExistence)(res)
        ? res.status(404).send("No Popular Patient till now")
        : res.send(popularPet);
};
exports.getMostPopularPet = getMostPopularPet;
