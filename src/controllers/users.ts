import { Request, Response } from "express";
import { insertNewUser } from "../models/queries/users";
// import { NewUser } from "../models/schema";
import bcrypt from "bcrypt";
import { NewUserSchema } from "../types/zod-validations/user";
import logger from "../lib/logger";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    await NewUserSchema.parseAsync(req.body);
    const { email, password, user_type } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const [new_user] = await insertNewUser({ email, password_hash, user_type });
    if (new_user) {
      res.status(201).json(new_user);
      logger.info('New user created successfully!')
    }
  } catch (error) {
    console.error(error);
    return logger.error(error)
  }
};
