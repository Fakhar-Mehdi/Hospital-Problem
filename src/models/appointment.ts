import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  sTime: { type: Number, required: true, min: 0, max: 23 },
  eTime: {
    type: Number,
    required: true,
    min: 1,
    max: 24,
    //validation sTime<eTime
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
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
