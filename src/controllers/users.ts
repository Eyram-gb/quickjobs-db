import { Request, Response } from "express";
import logger from "../lib/logger";
import { findAllUsers, findUserById } from "../models/queries/users";

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
    const user = await findUserById(userId);

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
