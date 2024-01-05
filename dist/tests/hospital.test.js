"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const supertest_1 = __importDefault(require("supertest"));
const patient_1 = __importDefault(require("models/patient"));
let patient;
let payload;
payload = {
    startTime: 15,
    endTime: 17,
    description: "Testing",
    fee: 1000,
    patientId: "",
    date: "1/2/23",
    isFeePaid: false,
};
describe("add dummy data", () => {
    beforeAll(async () => {
        await (await index_1.default).close();
    });
    afterAll(async () => {
        await (await index_1.default).close();
    });
    it("should create appointments", async () => {
        patient = new patient_1.default({
            name: "hiuhiu",
            ownerName: "memer",
            ownerAddress: "lhr",
            ownerPhone: "123456789789",
            noOfLegs: "4",
        });
        await patient.save();
        payload.patientId = patient._id;
        let result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
        result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
        result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
        payload.date = "12/24/23";
        result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
        result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
        result = await (0, supertest_1.default)(await index_1.default)
            .post("/api/appointment")
            .send(payload);
        expect(JSON.stringify(result.text)).toContain("Created");
    });
});
describe("testing the hospital route", () => {
    beforeAll(async () => {
        await (await index_1.default).close();
    });
    it("should test the weekly endpoint", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).get("/api/hospital/weekly");
        expect(JSON.stringify(res)).toContain("3");
    });
    it("should test the monthly endpoint", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).get("/api/hospital/monthly");
        expect(JSON.stringify(res)).toContain("6");
    });
    it("should test the most popular pet endpoint", async () => {
        const res = await (0, supertest_1.default)(await index_1.default).get("/api/hospital/popular");
        expect(JSON.stringify(res)).toContain(patient._id.toString());
    });
});
