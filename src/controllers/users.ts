import { Request, Response } from "express";
import { insertNewUser } from "../models/queries/users";
import { NewUser } from "../models/schema";
import { NewUserSchema } from "./types/zod-validations/user";

export const createtUser = async (req: Request, res: Response) => {
  try {
    await NewUserSchema.parseAsync(req.body);
    const { email, password_hash, user_type } = req.body as NewUser;
    const new_user = await insertNewUser({ email, password_hash, user_type });
    if (new_user) {
      res.status(201).json(new_user);
    }
  } catch (error) {
    console.error(error);
  }
};
