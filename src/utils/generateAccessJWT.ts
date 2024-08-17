import jwt from "jsonwebtoken";
export const generateAccessJWT = async (id: string) => {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    throw new Error("Missing ACCESS_TOKEN environment variable");
  }
  // Create a JSON Web Token (JWT) with the user ID and expire after 20 minutes
  return jwt.sign(id, ACCESS_TOKEN, {
    expiresIn: "20m",
  });
};
