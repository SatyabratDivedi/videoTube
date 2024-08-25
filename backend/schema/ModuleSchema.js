const mongoose = require("mongoose");


const ModuleSchema = new mongoose.Schema({
  title: String,
  videoPath: String,
});

const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;