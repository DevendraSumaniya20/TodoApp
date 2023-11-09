const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const mongodb =
  "mongodb+srv://user564:user564@cluster0.hzdc93r.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongodb)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

const Item = require("./models/items");

app.set("view engine", "ejs");
app.listen(3000);

app.get("/", function (req, res) {
  res.redirect("/get-items");

  res.render("index", { items: Item });
});
app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => {
      res.render("index", { items: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.post("/items", (req, res) => {
  console.log(req.body);

  const item = Item(req.body);

  item
    .save()
    .then(() => {
      res.redirect("/get-items");
    })
    .catch((err) => console.log(err));
});

app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findById(id).then((result) => {
    res.render("item-detail", { item: result });
  });
});

app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id).then((result) => {
    res.json({ redirect: "/get-items" });
  });
});

app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body).then((result) => {
    res.json({ msg: "item updated" });
  });
});

app.use((req, res) => {
  res.render("error");
});
