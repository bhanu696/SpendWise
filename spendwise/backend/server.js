const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);


const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transactions");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SpendWise API is running!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`SpendWise API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start SpendWise:", error.message);
    process.exit(1);
  }
}

startServer();
