import { userRoutes } from "./routes/users";
import express from "express";
import logger from "./lib/logger";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./lib/constants";
import { authRoutes } from "./routes/auth";
import cookieParser from "cookie-parser";
import { industriesRoutes } from "./routes/industries";
import { gigRoutes } from "./routes/gigs";

dotenv.config();

const app = express();

app.use(cookieParser());

// Middleware for logging requests
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg) } }));
// Enable CORS for all routes
app.use(cors(corsOptions));
// Middleware to parse JSON requests
app.use(express.json({ limit: "5mb" }));

app.use("/api", authRoutes); 
app.use("/api", userRoutes);
app.use("/api", gigRoutes); 
app.use("/api", industriesRoutes);

app.get("/", (req, res) => {
  res.send("We are live on quikjobs server");
});

app.listen(3300, () => {
  try {
    console.log(`Server is f*cking live on port 3300`);
  } catch (error) {
    console.log(error);
  }
});
