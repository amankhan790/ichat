import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

export default app;
