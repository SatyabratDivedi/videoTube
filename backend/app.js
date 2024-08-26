const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Module = require("./schema/ModuleSchema");
const Progress = require("./schema/progressSchema");

const app = express();
app.use(cors({
  origin: "https://video-tube-fun.vercel.app",
}));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

mongoose.connect("mongodb+srv://satya9005:satya9005@atlascluster.mzqnfii.mongodb.net/videoModule?retryWrites=true&w=majority&appName=AtlasCluster", {});
// app.post("/createvid", async (req, res) => {
//   const { title, videoPath } = req.body;
//   try {
//     console.log(title, videoPath);
//     const vid = new Module({ title, videoPath });
//     await vid.save();
//     console.log(vid);
//     res.status(201).json(vid);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get("/api/modules", async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(202).json(modules);
  } catch (error) {
    res.status(404).json({ msg: "module not found" });
  }
});

app.get("/api/modules/:id", async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    res.status(200).json(module);
  } catch (error) {
    res.status(404).json({ msg: "id not found" });
  }
});

app.get("/api/progress/:moduleId", async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: "testUser",
      moduleId: req.params.moduleId,
    });
    res.status(200).json(progress || { timestamp: 0 });
  } catch (error) {
    res.status(404).json({ msg: "module id not found" });
  }
});

app.post("/api/progress/:moduleId", async (req, res) => {
  try {
    let progress = await Progress.findOne({
      userId: "testUser",
      moduleId: req.params.moduleId,
    });
    if (!progress) {
      progress = new Progress({
        userId: "testUser",
        moduleId: req.params.moduleId,
        timestamp: req.body.timestamp,
      });
    } else {
      progress.timestamp = req.body.timestamp;
    }
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    res.status(404).json({ msg: "module id not found" });
  }
});

app.get("/api/progress", async (req, res) => {
  try {
    const totalModules = await Module.countDocuments();
    const watchedModules = await Progress.distinct("moduleId", { userId: "testUser" });
    const percentage = (watchedModules.length / totalModules) * 100;
    res.status(200).json({ percentage });
  } catch (error) {
    res.status(404).json({ msg: "not processing" });
  }
});

app.get("/", (req, res) => {
  res.send("Working fine!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
