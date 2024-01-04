"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const supertest_1 = __importDefault(require("supertest"));
const patient_1 = __importDefault(require("models/patient"));
const index_2 = require("helper/index");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const patient_2 = require("controllers/patient");
let patient;
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
        await (await index_1.default).close();
    });
    it("should add the patient and appointments", async () => {
        patient = new patient_1.default(await (0, index_2.validatePatient)(patientData));
        await patient.save();
        const res = await patient_1.default.findById(patient._id);
        expect(JSON.stringify(res)).toContain(patient._id.toString());
    });
});
describe("Unit Test of addPatient", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    let req = {
        body: {
            name: "john",
            ownerName: "bob",
            ownerAddress: "lhr",
            ownerPhone: "123456789123",
            noOfLegs: "4",
            currency: "USD",
        },
    };
    let status = 0;
    let received = "";
    let res = {
        status: (n) => {
            status = n;
        },
        send: (response) => {
            received = response;
        },
    };
    it("should check if patient is created or not", async () => {
        await (0, patient_2.addPatient)(req, res);
        expect(received).toContain("Created");
    });
});
describe("testing patient routes", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    it("should get one field of the patient", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).get(`/api/patient/${patient._id}/ownerName`);
        expect(JSON.stringify(res)).toContain(patientData.ownerName);
    });
    it("should add a patient", async () => {
        patientData.name = "inTestCase";
        await (0, supertest_1.default)(await index_1.default)
            .post("/api/patient/")
            .send(patientData);
        const saved = await patient_1.default.find({ name: patientData.name });
        expect(JSON.stringify(saved)).toContain(patientData.name);
    });
    it("should get patient by id through param", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).get(`/api/patient/${patient._id}`);
        expect(JSON.stringify(res)).toContain(patient._id.toString());
    });
    it("should update the patient", async () => {
        const oldRecord = await patient_1.default.findById(patient._id);
        const ownerName = "Test-Update";
        await (0, supertest_1.default)(await index_1.default)
            .put(`/api/patient/${patient._id}`)
            .send({ ownerName });
        const newRecord = await patient_1.default.findById(patient._id);
        expect(oldRecord.ownerName).toBe(patientData.ownerName);
        expect(newRecord.ownerName).toBe(ownerName);
    });
    it("should delete patient by id through param", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).delete(`/api/patient/${patient._id}`);
        expect(JSON.stringify(res)).toContain(patient._id.toString());
        const deleted = await patient_1.default.findById(patient._id);
        expect((0, lodash_1.isEmpty)(deleted)).toBe(true);
    });
});
