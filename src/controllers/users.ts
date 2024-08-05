import { Request, Response } from "express";
import { findUserByEmail, insertNewUser } from "../models/queries/users";
// import { NewUser } from "../models/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

export const loginUser = async (req:Request, res:Response) => {
   try {
     const password = await req.body.password;
     const email = await req.body.email;
     const [user] = await findUserByEmail(email);
     if (!user) {
       return res.status(404).json({
         message: "User not found",
       });
     }

     const isMatch = await bcrypt.compare(password, user.password_hash);
     if (!isMatch) {
       return res.status(400).json({
         message: "Wrong password",
       });
     }

     const token = jwt.sign(
       { email: user.email, password: user.password_hash },
       process.env.ACCESS_TOKEN_SECRET || ""
     );
     if (token) {
       return res.status(201).json({
         message: "login succesful",
         token,
         user,
       });
     }
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       message: "User login failed.",
       error,
     });
   }
}