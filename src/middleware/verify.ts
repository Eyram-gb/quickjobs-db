import jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import logger from '../lib/logger';

export async function Verify(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["cookie"]; // get the session cookie from request header

    if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
    const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN as string, async (err) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        logger.error('Session token is invalid or expired')
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }
      next();
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
