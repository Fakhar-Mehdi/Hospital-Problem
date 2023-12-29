import { SERVER } from "data";
import { NextFunction, Request, Response } from "express";
import { logger } from "helper";

const error = (err: any, req: Request, res: Response, next: NextFunction) => {
  //errorLogic
  if (res.statusCode === 200) res.status(500);
  res.send(
    logger(
      `Following Error Occurred:\n${err.message || SERVER.ERROR_MESSAGE}`,
      "error"
    )
  );
  next();
};

export default error;
