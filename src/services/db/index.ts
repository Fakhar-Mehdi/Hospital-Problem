import { Express } from "express";
import mongoose from "mongoose";
import winston from "winston";
import { DB } from "services/db/data";
import { SERVER } from "data";
// import { getConnectionString } from "helper/index";

export const connectToMongoDb = async () => {
  try {
    await mongoose.connect(DB.CONNECTION_STRING);
    winston.info(DB.SUCCESS_MESSAGE);
  } catch (e) {
    winston.error(`${DB.ERROR_MESSAGE}${e}`);
  }
};

const connectAndListen = async (app: Express) => {
  await connectToMongoDb();
  const port = 5000;
  // const port = process.env.PORT || 5000;
  return app.listen(port, () =>
    winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
  );
};

export default connectAndListen;
