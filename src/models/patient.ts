import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
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

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
