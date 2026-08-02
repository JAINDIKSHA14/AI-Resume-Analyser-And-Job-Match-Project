const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    skills: [String],
    description: String,
    applyLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);