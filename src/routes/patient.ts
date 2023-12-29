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
import asyncHandler from "middleware/asyncHandler";

const patientRouter = express.Router();

patientRouter.route("/:_id/:field").get(asyncHandler(getOneField));
patientRouter
  .route("/")
  .post(asyncHandler(addPatient))
  .get(asyncHandler(getAllPatients));
patientRouter.route("/balance").get(asyncHandler(getTotalBalance));
patientRouter.route("/dues").get(asyncHandler(getTotalDues));
patientRouter
  .route("/:_id")
  .delete(asyncHandler(deleteOnePatient))
  .get(asyncHandler(getPatientById))
  .put(asyncHandler(updatePatientDetails));
  
// patientRouter.route("/:_id").get(getPatientById);
// patientRouter.route("/:_id").put(updatePatientDetails);
export default patientRouter;
