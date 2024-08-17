import { Request, Response } from "express";
import {
  emailFound,
  findUserByEmail,
  insertNewUser,
} from "../models/queries/users";
// import { NewUser } from "../models/schema";
import bcrypt from "bcrypt";
import { NewUserSchema } from "../types/zod-validations/user";
import logger from "../lib/logger";
import { generateAccessJWT } from "../utils/generateAccessJWT";

export const registerNewUser = async (req: Request, res: Response) => {
  try {
    await NewUserSchema.parseAsync(req.body);
    const { email, password, user_type } = req.body;
    const password_hash = await bcrypt.hash(password, 12);
    const emailExists = await emailFound(email);
    if (emailExists) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const [new_user] = await insertNewUser({ email, password_hash, user_type });
    if (new_user) {
      res.status(201).json({
        user: {
          email: new_user.email,
          user_type: new_user.user_type,
          id: new_user.id,
        },
      });
      logger.info("New user created successfully!");
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error(error);
    return logger.error(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { password, email, id } = await req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
      });
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(500).json({
        message: "Access token secret not found",
      });
    }

    const [user] = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateAccessJWT(id);
    if (!token) {
      throw new Error("Token generation failed");
    }
    const options = {
      maxAge: 20 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      // sameSite: "None",
    };

    res.cookie("SessionID", token, options);

    logger.info("User logged in successfully!");
    return res.status(201).json({
      message: "You have logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({
      message: "User login failed.",
      error,
    });
  }
};
