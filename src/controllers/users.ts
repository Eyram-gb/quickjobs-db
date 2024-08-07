import { ApplicantProfile, EmployerProfile } from "./../models/schema/users";
import { Request, Response } from "express";
import logger from "../lib/logger";
import {
  findAllUsers,
  findUserById,
  insertNewApplicantProfile,
  insertNewEmployerProfile,
  modifyApplicantProfile,
  modifyEmployerProfile,
} from "../models/queries/users";
import {
  NewApplicantSchema,
  NewEmployerSchema,
} from "../types/zod-validations/user";

export const getAllUsers = async (res: Response) => {
  try {
    const users = await findAllUsers(); // replace with actual function call
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Failed to get all users");
    console.error("Failed to get all users: ", error);
    return res.status(500).json({ message: "Failed to get all users", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "no user ID provided" });
    }
    const [user] = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Failed to get user by ID");
    console.error("Failed to get user by ID: ", error);
    return res.status(500).json({ message: "Failed to get user by ID", error });
  }
};

export const createApplicantProfile = async (req: Request, res: Response) => {
  try {
    await NewApplicantSchema.parseAsync(req.body);
    const newApplicant = req.body;
    if (!newApplicant) {
      return res.status(400).json({ message: "no user provided" });
    }

    const applicantProfile = await insertNewApplicantProfile(newApplicant);

    if (!applicantProfile) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    return res.status(201).json(applicantProfile);
  } catch (error) {
    console.error(error);
    return logger.error(error);
  }
};
export const createEmployerProfile = async (req: Request, res: Response) => {
  try {
    await NewEmployerSchema.parseAsync(req.body);
    const newEmployer = req.body;
    if (!newEmployer) {
      return res.status(400).json({ message: "no user provided" });
    }

    const employerProfile = await insertNewEmployerProfile(newEmployer);

    if (!employerProfile) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    return res.status(201).json(employerProfile);
  } catch (error) {
    console.error(error);
    return logger.error(error);
  }
};

export const updateApplicantProfile = async (req: Request, res: Response) => {
  // TODO: add a middleware to validate provided params.id
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "no user ID provided" });
    }

    // ! destructure 'applicantProfile' to only the data that needs to be sent to the DB
    const applicantProfile = req.body as ApplicantProfile;
    if (!applicantProfile) {
      return res.status(400).json({ message: "no applicant profile provided" });
    }

    const updatedUser = await modifyApplicantProfile(applicantProfile);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Failed to update user");
    console.error("Failed to update user: ", error);
    return res.status(500).json({ message: "Failed to update user", error });
  }
};
export const updateEmployerProfile = async (req: Request, res: Response) => {
  // TODO: add a middleware to validate provided params.id
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "no user ID provided" });
    }

    // ! destructure 'applicantProfile' to only the data that needs to be sent to the DB
    const employerProfile = req.body as EmployerProfile;
    if (!employerProfile) {
      return res.status(400).json({ message: "no applicant profile provided" });
    }

    const updatedUser = await modifyEmployerProfile(employerProfile);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Failed to update user");
    console.error("Failed to update user: ", error);
    return res.status(500).json({ message: "Failed to update user", error });
  }
};
