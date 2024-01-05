// import { Express } from "express";
// import winston from "winston";
// import { DB } from "services/db/data";
// import { SERVER } from "data";
// // import { MongoClient } from "mongodb";
// import mongoose from "mongoose";
// import { App } from "supertest/types";
// // import { getConnectionString } from "helper/index";

// // export const connectToMongoDb = async () => {
// //   // const client = new MongoClient(process.env.DB_CONNECTION_STRING || "");
// //   // try {
// //   //   await mongoose.connect(process.env.DB_CONNECTION_STRING || "");
// //   //   // await client.connect();
// //   //   winston.info(DB.SUCCESS_MESSAGE);
// //   // } catch (e) {
// //   //   winston.error(`${DB.ERROR_MESSAGE}${e}`);
// //   // }
// // };

// // const connectAndListen = (app: Express) => {
// //   if (!process.env.DB_CONNECTION_STRING) {
// //     winston.error("DB_CONNECTION_STRING is not set. Exiting...");
// //     process.exit(1);
// //   }
// //   let server: App = app;

// //   mongoose
// //     .connect(process.env.DB_CONNECTION_STRING || "")
// //     .then((obj) => {
// //       winston.info(DB.SUCCESS_MESSAGE);
// //       const port = process.env.PORT || 3000;
// //       server = app.listen(port, () =>
// //         winston.info(`${SERVER.PORT_LISTEN_SUCCESS}${port}`)
// //       );
// //     })
// //     .catch((e) => {
// //       winston.error(`${DB.ERROR_MESSAGE}${e}`);
// //     });
// //   return server;
// // };

// // export default connectAndListen;
