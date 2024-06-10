require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const todo_route = require("./routes/todo.js");
const Music = require("./models/music.model.js");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log("DB connected successfully !!");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("DB connection failed !!");
  });

app.use("/public", express.static("public"));
app.use("/assets", express.static("assets"));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/music/:album", async (req, res) => {
  let data = await Music.find({ Album: `${req.params.album}` }, { _id: 0 });
  res.status(200).json(data);
});

app.use("/todo", todo_route);
