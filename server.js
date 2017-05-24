"use strict";
const express = require("express");
const Mongo = require("mongodb").MongoClient;
const Bing = require("node-bing-api")({accKey: process.env.BING_KEY});
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/api/:search", (req, res) => {
    Mongo.connect(process.env.MONGO_URI, (err, db) => {
        if (err) console.log(err);
        const latest = db.collection("latest");
        latest.insertOne({
            term: req.params.search,
            when: new Date().toUTCString()
        });
        db.close();
    });
    let offset = parseInt(req.query.offset, 10) || 0;
    if (offset < 0) offset = 0;
    Bing.images(req.params.search, {
        top: 10,
        skip: offset
    }, (err, result, body) => {
        if (err) console.log(err);
         res.send(body.value.slice(0, 10).map((x) => {
             return {
                 name: x.name,
                 imageURL: x.thumbnailUrl,
                 pageURL: x.hostPageDisplayUrl
             };
        }));
    });
});

app.get("/api", (req, res) => {
    //access latest 10 searches
});

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(app.get("port"), () => {
    console.log(`Connected to port ${app.get("port")}.`);
});
