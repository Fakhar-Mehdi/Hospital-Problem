import { Request, Response } from "express";

export const homeEndPoint = async (req: Request, res: Response) => {
  res.send("App is Live");
};
