const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("AI Resume Analyser Backend is Running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});