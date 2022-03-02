require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const textSchema = {
  content: String,
  time: { type: Date, default: Date.now },
};

const Text = mongoose.model("Text", textSchema);

app.get("/", function (req, res) {
  Text.find({}, function (err, texts) {
    res.render("home", {
      texts: texts,
    });
  });
});

app.post("/", function (req, res) {
  const text = new Text({
    content: req.body.textMessage,
  });
  text.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
  console.log(text);
});

app.get("/changelog", function (req, res) {
  res.render("changelog");
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server has started successfully");
});
