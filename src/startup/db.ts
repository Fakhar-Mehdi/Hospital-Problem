import { Express } from "express";
import mongoose from "mongoose";
import winston from "winston";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost/hospital");
    winston.info("Connected to mongoDb");
  } catch (e) {
    winston.error(
      `\nUnable to connect to mongodb.\n\nFollowing error occurred:\n${e}`
    );
  }
};

const connectAndListen = async (app: Express) => {
  await connectToMongoDb();
  const port = process.env.PORT || 3000;
  app.listen(port, () => winston.info(`Listening to port ${port}`));
};

export default connectAndListen;
