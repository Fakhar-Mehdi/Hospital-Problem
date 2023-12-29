import { Request, Response } from "express";
import { checkExistence, sendAndLog } from "helper";
import Appointment from "models/appointment";

const getDaysBeforeDate = (days: number) => {
  return days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : new Date();
};

export const getWeeklyDetails = async (req: Request, res: Response) => {
  getPreviousRecord(7, res);
};

export const getMonthlyDetails = async (req: Request, res: Response) => {
  getPreviousRecord(30, res);
};

const getPreviousRecord = async (days: number, res: Response) => {
  const daysAgo = getDaysBeforeDate(days);
  const appointments = await Appointment.find({
    date: { $gte: daysAgo, $lte: new Date() },
  }).select({ fee: 1, isFeePaid: 1, currency: 1, _id: 0 });

  if (!checkExistence(appointments)) {
    res.status(404);
    sendAndLog(res, `No appointments in the past ${days} days`);
    return;
  }
  let balance = 0,
    unpaid = 0;

  appointments.forEach((a) => {
    let money = a.fee;
    if (a.currency === "BTC") money *= 43000;
    else if (a.currency === "EUR") money *= 1.11;

    if (a.isFeePaid) balance += money;
    else unpaid += money;
  });

  sendAndLog(
    res,
    `Got ${appointments.length} Appointment in the last ${days} days\nBalance: ${balance}\nUnpaid: ${unpaid}`
  );
};
