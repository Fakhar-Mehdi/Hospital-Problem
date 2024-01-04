import server from "../index";
import request from "supertest";
import Patient from "models/patient";
import { validatePatient } from "helper/index";
import { isEmpty } from "lodash";
import mongoose from "mongoose";

let patient: any;
let patientData = {
  name: "john",
  ownerName: "bob",
  ownerAddress: "lhr",
  ownerPhone: "123456789123",
  noOfLegs: "4",
  currency: "USD",
};

describe("add dummy data", () => {
  beforeAll(async () => {
    await (await server).close();
  });
  // afterAll(async () => {
  //   await (await server).close();
  // });
  it("should add the patient and appointments", async () => {
    patient = new Patient(await validatePatient(patientData));
    await patient.save();
    const res = await Patient.findById(patient._id);
    expect(JSON.stringify(res)).toContain(patient._id.toString());
  });
});

describe("testing patient routes", () => {
  afterAll(async () => {
    await (await server).close();
  });
  afterAll(async () => {
    // Close the Mongoose connection after all tests are completed
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should get one field of the patient", async () => {
    const res = await request(await server).get(
      `/api/patient/${patient._id}/ownerName`
    );
    expect(JSON.stringify(res)).toContain(patientData.ownerName);
  });

  it("should add a patient", async () => {
    patientData.name = "inTestCase";
    await request(await server)
      .post("/api/patient/")
      .send(patientData);

    const saved = await Patient.find({ name: patientData.name });

    expect(JSON.stringify(saved)).toContain(patientData.name);
  });

  it("should get patient by id through param", async () => {
    const res = await request(await server).get(`/api/patient/${patient._id}`);
    expect(JSON.stringify(res)).toContain(patient._id.toString());
  });

  it("should update the patient", async () => {
    const oldRecord: any = await Patient.findById(patient._id);
    const ownerName = "Test-Update";
    await request(await server)
      .put(`/api/patient/${patient._id}`)
      .send({ ownerName });
    const newRecord: any = await Patient.findById(patient._id);
    expect(oldRecord.ownerName).toBe(patientData.ownerName);
    expect(newRecord.ownerName).toBe(ownerName);
  });

  it("should delete patient by id through param", async () => {
    const res = await request(await server).delete(
      `/api/patient/${patient._id}`
    );
    expect(JSON.stringify(res)).toContain(patient._id.toString());
    const deleted = await Patient.findById(patient._id);

    expect(isEmpty(deleted)).toBe(true);
  });
});
