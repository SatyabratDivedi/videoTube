const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: String,
  moduleId: mongoose.Schema.Types.ObjectId,
  timestamp: Number,
});

const Progress = mongoose.model("Progress", ProgressSchema);

module.exports = Progress;
