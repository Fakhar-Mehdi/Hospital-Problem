"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const patientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 35,
    },
    noOfLegs: {
        type: String,
        enum: ["4", "2", "1", "0"],
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 35,
    },
    ownerAddress: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 200,
    },
    ownerPhone: {
        type: String,
        required: true,
        trim: true,
        minLength: 11,
        maxLength: 15,
    },
    billPaid: {
        type: Number,
        default: 0,
        min: 0,
    },
    billRemaining: {
        type: Number,
        default: 0,
        min: 0,
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "BTC"],
        default: "USD",
    },
    appointmentCount: {
        type: Number,
        default: 0,
        min: 0,
    },
});
const Patient = mongoose_1.default.model("Patient", patientSchema);
exports.default = Patient;
