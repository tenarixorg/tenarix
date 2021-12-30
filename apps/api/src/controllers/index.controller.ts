import { Request, Response } from "express";

export const index = async (_req: Request, res: Response) => {
  return res.json({
    msg: "Api Up!",
  });
};
