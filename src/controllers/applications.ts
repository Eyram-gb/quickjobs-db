import { Request, Response } from "express";
import logger from "../lib/logger";
import { insertNewApplication } from "../models/queries/applications";
import { TNewApplication } from "../models/schema";

export const newApplication = async (req: Request, res: Response) => {
  try {
    const data = req.body as TNewApplication;
    const resData = await insertNewApplication(data);
    if (!resData) {
      console.log("Could not insert new application");
      return logger.error("Could not insert new application");
    }
    return res.status(201).json({
      message: "Gig Application submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return logger.error("Could not insert new application");
  };
