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
    let search = req.params.search;
    const conainsAnd = search.indexOf("&");
    if (conainsAnd > -1) {
        search = search.strstr(0, containsAnd - 1);
    }
    Mongo.connect(process.env.MONGO_URI, (err, db) => {
        if (err) console.log(err);
        const latest = db.collection("latest");
        latest.insertOne({
            term: search,
            when: new Date().toUTCString()
        });
        db.close();
    });
    let offset = parseInt(req.query.offset, 10) || 0;
    if (offset < 0) offset = 0;
    Bing.images(search, {
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
    Mongo.connect(process.env.MONGO_URI, (err, db) => {
        if (err) console.log(err);
        const latest = db.collection("latest");
        latest.find({}, {_id: false}).toArray((err, docs) => {
            if (err) console.log(err);
            res.send(docs.reverse().slice(0, Math.min(10, docs.length)));
            db.close();
        });
    });
});

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(app.get("port"), () => {
    console.log(`Connected to port ${app.get("port")}.`);
});
