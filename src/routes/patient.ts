import express from "express";
import {
  addPatient,
  deleteOnePatient,
  getAllPatients,
  getOneField,
  getPatientById,
  getTotalBalance,
  getTotalDues,
  updatePatientDetails,
} from "controllers/patient";

const patientRouter = express.Router();

patientRouter.route("/:_id/:field").get(getOneField);
patientRouter.route("/").post(addPatient).get(getAllPatients);
patientRouter.route("/balance").get(getTotalBalance);
patientRouter.route("/dues").get(getTotalDues);
patientRouter.route("/:_id").delete(deleteOnePatient);
patientRouter.route("/:_id").get(getPatientById);
patientRouter.route("/:_id").put(updatePatientDetails);
export default patientRouter;
