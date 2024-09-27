import { Request, Response } from "express";
import logger from "../lib/logger";
import { findEmployerApplications, insertNewApplication } from "../models/queries/applications";
import { TNewApplication } from "../models/schema";

export const newApplication = async (req: Request, res: Response) => {
  try {
    const data = req.body as TNewApplication;
    const resData = await insertNewApplication(data) as TNewApplication;
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
  }
}

export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    const employerId = req.params.id;
    const gigId = req.query.gigId as string; // Get gigId from query parameters
    const gigs = await findEmployerApplications(employerId, gigId); // Pass gigId to the query
    if (!gigs) {
      return res.status(404).json({ message: "No gigs found for this employer" });
    }
    return res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to get employer gigs", error });
  }
}
