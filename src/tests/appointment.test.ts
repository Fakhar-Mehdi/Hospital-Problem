import server from "../index";
import request from "supertest";
import Patient from "models/patient";
import Appointment from "models/appointment";
import { validatePatient } from "helper/index";
import { isEmpty } from "lodash";
import { addAppointment } from "controllers/appointment";

let payload: {
  startTime?: number;
  endTime?: number;
  description?: string;
  fee?: number;
  patientId?: string;
  date?: string;
  isFeePaid?: boolean;
  _id?: string;
};
let patient: any;
let appointment: any;

describe("add dummy data", () => {
  beforeAll(async () => {
    await (await server).close();
  });
  // afterAll(async () => {
  //   await (await server).close();
  // });
  it("should add the patient and appointments", async () => {
    let patientData = {
      name: "john",
      ownerName: "bob",
      ownerAddress: "lhr",
      ownerPhone: "123456789123",
      noOfLegs: "4",
      currency: "USD",
    };
    patient = new Patient(await validatePatient(patientData));
    await patient.save();
    let appointmentData = {
      startTime: 15,
      endTime: 17,
      description: "fakhar",
      fee: 1000,
      patientId: patient._id,
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
    appointment = new Appointment(appointmentData);
    await appointment.save();

    let saved = await Patient.findById(patient._id);
    expect(isEmpty(saved)).toEqual(false);

    saved = await Appointment.findById(appointment._id);
    expect(isEmpty(saved)).toEqual(false);
  });
});

describe("add appointment", () => {
  afterAll(async () => {
    await (await server).close();
  });
  beforeEach(async () => {
    payload = {
      startTime: 15,
      endTime: 17,
      description: "hello",
      fee: 1000,
      patientId: "658eefb086933a93ec2b5da3",
      date: "10/15/23",
      isFeePaid: false,
    };
  });

  it("should return 200 after creating appointment and incrementing the patient", async () => {
    const patient: any = new Patient({
      name: "hiuhiu",
      ownerName: "memer",
      ownerAddress: "lhr",
      ownerPhone: "123456789789",
      noOfLegs: "4",
    });
    await patient.save();
    payload.patientId = patient._id;
    const oldRecord: any = await Patient.findById(payload.patientId);
    const result: any = await request(await server)
      .post("/api/appointment")
      .send(payload);
    const newRecord: any = await Patient.findById(payload.patientId);
    expect(JSON.stringify(result.text)).toContain("Created");
    expect(newRecord.appointmentCount).toBe(oldRecord.appointmentCount + 1);
  });

  it("should return 400 for empty body", async () => {
    const res = await request(await server).post("/api/appointment");
    expect(res.status).toBe(400);
    //  await  (await server).close();
  });

  it("should return 404 for wrong patientId", async () => {
    payload.patientId = "658eefb086933a93ec2b5da5";
    const res = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(res.status).toBe(404);
  });
});

describe("update appointment", () => {
  afterAll(async () => {
    await (await server).close();
  });
  beforeEach(() => {
    payload = {
      startTime: 15,
      endTime: 17,
      description: "hello",
      fee: 1000,
      patientId: "658eefc486933a93ec2b5da7",
      date: "12/15/23",
      isFeePaid: false,
      _id: "658efc26d25e29412158c74d",
    };
  });

  it("should return 400 in the absence of id", async () => {
    payload._id = "";
    const result = await request(await server)
      .put("/api/appointment")
      .send(payload);
    expect(result.status).toBe(400);
  });

  it("should throw an error for startTime>endTime", async () => {
    payload.startTime = 5;
    payload.endTime = 4;
    payload._id = appointment._id;
    payload.patientId = patient._id;

    const result = await request(await server)
      .put("/api/appointment")
      .send(payload);

    expect(result.text).toContain(
      "Appointment MUST be started before its ended"
    );
  });

  it("should send 404 for wrong appointmentId", async () => {
    const result = await request(await server)
      .put("/api/appointment")
      .send(payload);

    expect(result.text).toContain("Appointment Not Found");
  });

  it("should send 404 for wrong patientId", async () => {
    payload._id = appointment._id;
    payload.patientId = "123456789123456789123456";

    const result = await request(await server)
      .put("/api/appointment")
      .send(payload);

    expect(result.text).toContain("Patient Not Found");
  });
});

describe("get appointments", () => {
  afterAll(async () => {
    await (await server).close();
  });
  it("should return appointments for a patient", async () => {
    const res: any = await request(await server)
      .get("/api/appointment/")
      .query({ patientId: patient._id });
    expect(res.status).toBe(200);

    expect(JSON.stringify(res)).toContain(patient._id.toString());
  });

  it("should get appointments for a day", async () => {
    const res: any = await request(await server)
      .get("/api/appointment/")
      .query({ day: "1/1/24" });

    expect(JSON.stringify(res)).toContain(appointment._id.toString());
  });
});

describe("Unit Test of addAppointment", () => {
  afterAll(async () => {
    await (await server).close();
  });

  let req: any = {
    body: {
      startTime: 15,
      endTime: 17,
      description: "UNIT TESTING",
      fee: 1000,
      patientId: "",
      date: "12/15/23",
      isFeePaid: false,
    },
  };

  let status: number = 0;

  let received: string = "";
  let res: any = {
    status: (n: number) => {
      status = n;
    },
    send: (response: any) => {
      received = response;
    },
  };

  it("should check if appointment is created or not", async () => {
    req.body.patientId = patient._id.toString();
    await addAppointment(req, res);
    expect(status).toBe(200);
    expect(received).toContain("Created");
  });

  it("should check if the appointmentCount is incremented or not", async () => {
    const oldRecord = await Patient.findById(patient._id);
    await addAppointment(req, res);
    let newRecord = await Patient.findById(patient._id);
    if (oldRecord)
      expect(newRecord?.appointmentCount).toBe(oldRecord.appointmentCount + 1);
  });
});

describe("delete the appointment", () => {
  afterAll(async () => {
    await (await server).close();
  });
  it("should delete the appointments and patient", async () => {
    await Patient.findByIdAndDelete(patient._id);
    const saved = await Appointment.findById(appointment._id);
    expect(isEmpty(saved)).toEqual(false);
    await request(await server).delete(
      `/api/appointment/${appointment._id.toString()}`
    );
    const deleted = await Appointment.findById(appointment._id);
    expect(isEmpty(deleted)).toEqual(true);
  });
});
