"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const supertest_1 = __importDefault(require("supertest"));
const patient_1 = __importDefault(require("models/patient"));
const appointment_1 = __importDefault(require("models/appointment"));
const index_2 = require("helper/index");
const lodash_1 = require("lodash");
const appointment_2 = require("controllers/appointment");
let payload;
let patient;
let appointment;
describe("add dummy data", () => {
    beforeAll(async () => {
        await (await index_1.default).close();
    });
    it("should add the patient and appointments", async () => {
        let patientData = {
            name: "john",
            ownerName: "bob",
            ownerAddress: "lhr",
            ownerPhone: "123456789123",
            noOfLegs: "4",
            currency: "USD",
        };
        patient = new patient_1.default(await (0, index_2.validatePatient)(patientData));
        await patient.save();
        let appointmentData = {
            sTime: 15,
            eTime: 17,
            desc: "fakhar",
            fee: 1000,
            pId: patient._id,
            date: new Date("1/1/24"),
            isFeePaid: false,
            currency: "USD",
        };
        if (appointmentData.isFeePaid)
            patient.billPaid = appointmentData.fee + (patient.billPaid || 0);
        else
            patient.billRemaining =
                appointmentData.fee + (patient.billRemaining || 0);
        patient.appointmentCount = 1 + (patient.appointmentCount || 0);
        await patient.save();
        appointment = new appointment_1.default(appointmentData);
        await appointment.save();
        let saved = await patient_1.default.findById(patient._id);
        expect((0, lodash_1.isEmpty)(saved)).toEqual(false);
        saved = await appointment_1.default.findById(appointment._id);
        expect((0, lodash_1.isEmpty)(saved)).toEqual(false);
    });
});
describe("add appointment", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    beforeEach(async () => {
        payload = {
            sTime: 15,
            eTime: 17,
            desc: "hello",
            fee: 1000,
            pId: "658eefb086933a93ec2b5da3",
            date: "10/15/23",
            isFeePaid: false,
        };
    });
    it("should return 200 after creating appointment and incrementing the patient", async () => {
        const patient = new patient_1.default({
            name: "hiuhiu",
            ownerName: "memer",
            ownerAddress: "lhr",
            ownerPhone: "123456789789",
            noOfLegs: "4",
        });
        await patient.save();
        payload.pId = patient._id;
        const oldRecord = await patient_1.default.findById(payload.pId);
        const result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        const newRecord = await patient_1.default.findById(payload.pId);
        expect(JSON.stringify(result.text)).toContain("Created");
        expect(newRecord.appointmentCount).toBe(oldRecord.appointmentCount + 1);
    });
    it("should return 400 for empty body", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).post("/api/appointment");
        expect(res.status).toBe(400);
    });
    it("should return 404 for wrong pId", async () => {
        payload.pId = "658eefb086933a93ec2b5da5";
        const res = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(res.status).toBe(404);
    });
});
describe("update appointment", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    beforeEach(() => {
        payload = {
            sTime: 15,
            eTime: 17,
            desc: "hello",
            fee: 1000,
            pId: "658eefc486933a93ec2b5da7",
            date: "12/15/23",
            isFeePaid: false,
            _id: "658efc26d25e29412158c74d",
        };
    });
    it("should return 400 in the absence of id", async () => {
        payload._id = "";
        const result = await (0, supertest_1.default)(await index_1.default)
            .put("/api/appointment")
            .send(payload);
        expect(result.status).toBe(400);
    });
    it("should throw an error for sTime>eTime", async () => {
        payload.sTime = 5;
        payload.eTime = 4;
        payload._id = appointment._id;
        payload.pId = patient._id;
        const result = await (0, supertest_1.default)(await index_1.default)
            .put("/api/appointment")
            .send(payload);
        expect(result.text).toContain("Appointment MUST be started before its ended");
    });
    it("should send 404 for wrong appointmentId", async () => {
        const result = await (0, supertest_1.default)(await index_1.default)
            .put("/api/appointment")
            .send(payload);
        expect(result.text).toContain("Appointment Not Found");
    });
    it("should send 404 for wrong patientId", async () => {
        payload._id = appointment._id;
        payload.pId = "123456789123456789123456";
        const result = await (0, supertest_1.default)(await index_1.default)
            .put("/api/appointment")
            .send(payload);
        expect(result.text).toContain("Patient Not Found");
    });
});
describe("get appointments", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    it("should return appointments for a patient", async () => {
        const res = await (0, supertest_1.default)(await index_1.default)
            .get("/api/appointment/")
            .query({ pId: patient._id });
        expect(res.status).toBe(200);
        expect(JSON.stringify(res)).toContain(patient._id.toString());
    });
    it("should get appointments for a day", async () => {
        const res = await (0, supertest_1.default)(await index_1.default)
            .get("/api/appointment/")
            .query({ day: "1/1/24" });
        expect(JSON.stringify(res)).toContain(appointment._id.toString());
    });
});
describe("Unit Test of addAppointment", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    let req = {
        body: {
            sTime: 15,
            eTime: 17,
            desc: "UNIT TESTING",
            fee: 1000,
            pId: "",
            date: "12/15/23",
            isFeePaid: false,
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
    it("should check if appointment is created or not", async () => {
        req.body.pId = patient._id.toString();
        await (0, appointment_2.addAppointment)(req, res);
        expect(status).toBe(200);
        expect(received).toContain("Created");
    });
    it("should check if the appointmentCount is incremented or not", async () => {
        const oldRecord = await patient_1.default.findById(patient._id);
        await (0, appointment_2.addAppointment)(req, res);
        let newRecord = await patient_1.default.findById(patient._id);
        if (oldRecord)
            expect(newRecord?.appointmentCount).toBe(oldRecord.appointmentCount + 1);
    });
});
describe("delete the appointment", () => {
    afterAll(async () => {
        await (await index_1.default).close();
    });
    it("should delete the appointments and patient", async () => {
        await patient_1.default.findByIdAndDelete(patient._id);
        const saved = await appointment_1.default.findById(appointment._id);
        expect((0, lodash_1.isEmpty)(saved)).toEqual(false);
        await (0, supertest_1.default)(await index_1.default).delete(`/api/appointment/${appointment._id.toString()}`);
        const deleted = await appointment_1.default.findById(appointment._id);
        expect((0, lodash_1.isEmpty)(deleted)).toEqual(true);
    });
});
