import { Express } from "express";
import mongoose from "mongoose";
import winston from "winston";
import { DB } from "services/db/data";
import { SERVER } from "data";
// import { getConnectionString } from "helper/index";

export const connectToMongoDb = async () => {
  try {
    if (process.env.CONNECTION_STRING)
      await mongoose.connect(process.env.CONNECTION_STRING);
    winston.info(DB.SUCCESS_MESSAGE);
  } catch (e) {
    winston.error(`${DB.ERROR_MESSAGE}${e}`);
  }
};

const connectAndListen = async (app: Express) => {
  await connectToMongoDb();
  const port = process.env.PORT || 5000;
  return app.listen(port, () =>
    winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
  );
};

export default connectAndListen;
