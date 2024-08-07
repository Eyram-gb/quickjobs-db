import "dotenv/config";
import { CorsOptions } from "cors";
export const prod = process.env.NODE_ENV === "production";

export const corsOptions: CorsOptions = {
  // Allow any origin
  origin: (origin, callback) => {
    callback(null, true);
  },
};
