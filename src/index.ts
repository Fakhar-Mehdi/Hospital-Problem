import express from "express";
import dotenv from "dotenv";
import configureLogger from "startup/logger";
import subscribeRouters from "startup/routes";
import connectAndListen from "startup/db";

configureLogger();
dotenv.config();
const app = express();
subscribeRouters(app);
connectAndListen(app);
