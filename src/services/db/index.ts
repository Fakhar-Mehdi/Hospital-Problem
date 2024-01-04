import { Express } from "express";
import mongoose from "mongoose";
import winston from "winston";
import { DB } from "services/db/data";
import { SERVER } from "data";
import { MongoClient } from "mongodb";
// import { getConnectionString } from "helper/index";

export const connectToMongoDb = async () => {
  const client = new MongoClient(process.env.CONNECTION_STRING || "");

  try {
    // await mongoose.connect();
    await client.connect();
    winston.info(DB.SUCCESS_MESSAGE);
  } catch (e) {
    winston.error(`${DB.ERROR_MESSAGE}${e}`);
  }
};

const connectAndListen = async (app: Express) => {
  await connectToMongoDb();
  const port = process.env.PORT || 5000;
  return await app.listen(port, () =>
    winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
  );
};

export default connectAndListen;
