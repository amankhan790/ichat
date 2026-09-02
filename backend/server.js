import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import dns from "dns";
import job from "./src/lib/cron.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    job.start();
  }
});
