const express = require("express");
const boydParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(boydParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const schema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", schema);

app.get("/articles", function (req, res) {
  Article.find({}, function (err, FoundArticles) {
    res.send(FoundArticles);
  });
});

app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function (err) {
    if (!err) res.send("<h1>Document is Saved Successfully!</h1>");
    else res.send("<h1>Somethig went wrong Please Try Again!</h1>");
  });
});

app.delete("/articles", function (req, res) {
  Article.deleteMany({}, function (err) {
    if (!err) res.send("<h1>All Articles are deleted Successfully!</h1>");
    else res.send(err);
  });
});

//chaining method is used for the Http verbs

app
  .route("/articles/:articleName")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleName }, function (err, result) {
      if (!err) {
        res.send(result);
      } else res.send(err, "<h1>Oops! that don't Exsist.</h1>");
    });
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.articleName },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwrite: true },
      function (err) {
        if (!err) res.send("<h1>Document is Updated Successfully!</h1>");
        else res.send("<h1>Somethig went wrong Please Try Again!</h1>");
      }
    );
  })

  .patch(function (req, res) {
    Article.update({ title: req.body.articleName },
      { $set: req.body },
      function (err) {
          if (!err) res.send("<h1>Document is Updated Successfully!</h1>");
          else res.send("<h1>Somethig went wrong Please Try Again!</h1>");
      });
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.body.title }, function (err) {
      if (!err) res.send("<h1>Document is Deleted Successfully!</h1>");
      else res.send("<h1>Somethig went wrong Please Try Again!</h1>");
    });
  });

app.listen("3000", () => {
  console.log("Server is Running on Port 3000");
});
