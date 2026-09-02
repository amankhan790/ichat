import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
