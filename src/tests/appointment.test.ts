import server from "../index";
import request from "supertest";
import { Server } from "http";
import Patient from "models/patient";
import Appointment from "models/appointment";

let host: Promise<Server>;
let payload: {
  sTime?: number;
  eTime?: number;
  desc?: string;
  fee?: number;
  pId?: string;
  date?: string;
  isFeePaid?: boolean;
  _id?: string;
};

// describe("add appointment", () => {
//   beforeEach(async () => {
//     host = server;
//     payload = {
//       sTime: 15,
//       eTime: 17,
//       desc: "hello",
//       fee: 1000,
//       pId: "658eefb086933a93ec2b5da3",
//       date: "12/15/23",
//       isFeePaid: false,
//     };
//   });

//   afterEach(async () => {
//     (await server).close();
//   });

//   it("should return 200 after creating appointment and incrementing the patient", async () => {
//     const patient: any = new Patient({
//       name: "hiuhiu",
//       ownerName: "memer",
//       ownerAddress: "lhr",
//       ownerPhone: "123456789789",
//       noOfLegs: "4",
//     });
//     await patient.save();
//     payload.pId = patient._id;
//     const oldRecord: any = await Patient.findById(payload.pId);
//     const result: any = await request(await host)
//       .post("/api/appointment")
//       .send(payload);
//     const newRecord: any = await Patient.findById(payload.pId);
//     expect(JSON.stringify(result.text)).toContain("Created");
//     expect(newRecord.appointmentCount).toBe(oldRecord.appointmentCount + 1);
//   });

//   it("should return 400 for empty body", async () => {
//     const res = await request(await host).post("/api/appointment");
//     expect(res.status).toBe(400);
//     // (await server).close();
//   });

//   it("should return 404 for wrong pId", async () => {
//     payload.pId = "658eefb086933a93ec2b5da5";
//     const res = await request(await host)
//       .post("/api/appointment")
//       .send(payload);
//     expect(res.status).toBe(404);
//   });
// });

// describe("update appointment", () => {
//   beforeEach(() => {
//     host = server;
//     payload = {
//       sTime: 15,
//       eTime: 17,
//       desc: "hello",
//       fee: 1000,
//       pId: "658eefc486933a93ec2b5da7",
//       date: "12/15/23",
//       isFeePaid: false,
//       _id: "658efc26d25e29412158c74d",
//     };
//   });
//   afterEach(async () => {
//     (await server).close();
//   });

//   it("should return 400 in the absence of id", async () => {
//     payload._id = "";
//     const result = await request(await server)
//       .put("/api/appointment")
//       .send(payload);
//     expect(result.status).toBe(400);
//   });

//   it("should throw an error for sTime>eTime", async () => {
//     payload.sTime = 5;
//     payload.eTime = 4;
//     payload._id = "658efc26d25e29412158c74d";
//     delete payload.pId;

//     const result = await request(await server)
//       .put("/api/appointment")
//       .send(payload);

//     expect(result.text).toContain(
//       "Appointment MUST be started before its ended"
//     );
//   });

//   it("should send 404 for wrong appointmentId", async () => {
//     payload._id = "658efc26d25e29412158c749";

//     const result = await request(await server)
//       .put("/api/appointment")
//       .send(payload);

//     expect(result.text).toContain("Appointment Not Found");
//   });

//   it("should send 404 for wrong patientId", async () => {
//     payload.pId = "123456789123456789123456";

//     const result = await request(await server)
//       .put("/api/appointment")
//       .send(payload);

//     expect(result.text).toContain("Patient Not Found");
//   });
// });

describe("get appointments", () => {
  it("should return appointments for a patient", async () => {
    const patient: any = new Patient({
      name: "hiuhiu",
      ownerName: "memer",
      ownerAddress: "lhr",
      ownerPhone: "123456789789",
      noOfLegs: "4",
    });
    await patient.save();
    const appointment: any = new Appointment({
      sTime: 15,
      eTime: 17,
      desc: "hello",
      fee: 1000,
      pId: patient._id,
      date: "12/15/23",
      isFeePaid: false,
    });
    await appointment.save();
    const res: any = await request(await server)
      .get("/api/appointment/")
      .query({ pId: patient._id.toString() });
    expect(res.status).toBe(200);
    expect(JSON.stringify(res)).toContain(patient._id.toString());
  });
});
