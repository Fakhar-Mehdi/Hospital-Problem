import server from "../index";
import request from "supertest";
import Patient from "models/patient";
// import Appointment from "models/appointment";
// import { validatePatient } from "helper/index";
// import { isEmpty } from "lodash";
//

let patient: any;
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
payload = {
  sTime: 15,
  eTime: 17,
  desc: "Testing",
  fee: 1000,
  pId: "",
  date: "1/2/23",
  isFeePaid: false,
};

describe("add dummy data", () => {
  beforeAll(async () => {
    await (await server).close();
  });
  afterAll(async () => {
    await (await server).close();
  });

  it("should create appointments", async () => {
    patient = new Patient({
      name: "hiuhiu",
      ownerName: "memer",
      ownerAddress: "lhr",
      ownerPhone: "123456789789",
      noOfLegs: "4",
    });
    await patient.save();

    payload.pId = patient._id;

    let result: any = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");

    result = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");
    result = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");

    payload.date = "12/24/23";

    result = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");

    result = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");
    result = await request(await server)
      .post("/api/appointment")
      .send(payload);
    expect(JSON.stringify(result.text)).toContain("Created");
  });
});

describe("testing the hospital route", () => {
  // beforeEach(async () => {
  //   await (await server).close();
  // });
  beforeAll(async () => {
    await (await server).close();
  });
  it("should test the weekly endpoint", async () => {
    const res = await request(await server).get("/api/hospital/weekly");
    expect(JSON.stringify(res)).toContain("3");
  });

  it("should test the monthly endpoint", async () => {
    const res = await request(await server).get("/api/hospital/monthly");
    expect(JSON.stringify(res)).toContain("6");
  });

  it("should test the most popular pet endpoint", async () => {
    const res = await request(await server).get("/api/hospital/popular");
    expect(JSON.stringify(res)).toContain(patient._id.toString());
  });
});
