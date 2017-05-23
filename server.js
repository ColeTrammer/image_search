"use strict";
const express = require("express");
const Mongo = require("mongodb").MongoClient;
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(app.get("port"), () => {
    console.log(`Connected to port ${app.get("port")}.`);
});
