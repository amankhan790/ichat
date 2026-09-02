import mongoose from "mongoose";

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in env file");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to database", conn.connection.host);
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

export default connectDB;
