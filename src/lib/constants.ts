import "dotenv/config";
import { CorsOptions } from "cors";
export const prod = process.env.NODE_ENV === "production";

export const corsOptions: CorsOptions = {
  // Allow any origin
  origin: (origin, callback) => {
    callback(null, true);
  },
};

export const industriesArr = [
  "Marketing and Communications",
  "Banking and Finance",
  "Healthcare and Life Sciences",
  "Education and Research",
  "Entertainment and Media",
  "Environment and Sustainability",
  "Government and Non-Profit",
  "Professional Services",
] as const;