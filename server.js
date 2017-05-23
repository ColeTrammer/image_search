"use strict";
const express = require("express");
const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}.`)
});
