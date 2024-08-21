import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import logger from "../lib/logger";

export async function Verify(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieHeader = req.headers["cookie"]; // get the session cookie from request header
    console.log(cookieHeader);

    // if there is no cookie from request header, send an unauthorized response.
    if (!cookieHeader) {
      return res.status(401).json({ message: "Unauthorized: No cookie found" });
    }
    const cookie = cookieHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt
    // const cookies = cookie.parse(cookieHeader);
    // const token = cookies.QJSessionID;
    // console.log(token);
    
    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(
      cookie,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err) => {
        if (err) {
          // if token has been altered or has expired, return an unauthorized error
          logger.error("Session token is invalid or expired");
          return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
        }

        next();
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
