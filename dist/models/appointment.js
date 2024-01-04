"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    sTime: { type: Number, required: true, min: 0, max: 23 },
    eTime: {
        type: Number,
        required: true,
        min: 1,
        max: 24,
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 35,
    },
    fee: {
        type: Number,
        default: 0,
        min: 0,
    },
    pId: {
        type: String,
        minLength: 24,
        maxLength: 24,
        required: true,
    },
    date: { type: Date, default: Date.now },
    isFeePaid: { type: Boolean, default: false },
    currency: {
        type: String,
        enum: ["USD", "EUR", "BTC"],
        default: "USD",
    },
});
const Appointment = mongoose_1.default.model("Appointment", appointmentSchema);
exports.default = Appointment;
