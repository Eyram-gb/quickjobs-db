import { Request, Response } from "express";
import logger from "../lib/logger";
import { findAllIndustries } from "../models/queries/industries";

export const getAllIndustries = async (req: Request, res: Response) => {
  try {
    const industries = await findAllIndustries();
    if (!industries) {
      logger.error("No Industries found");
      return res.status(404).json({ message: "No industries found" });
    }
    return res.status(200).json(industries);
  } catch (error) {
    logger.error("Could not get industries");
    res
      .status(500)
      .json({ message: "Could not retireve all industries", error });
  }
};
