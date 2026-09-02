import express from "express";
import { clerkMiddleware } from '@clerk/express'

const app = express();
app.use(clerkMiddleware());

export default app;
