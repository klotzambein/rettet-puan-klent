const express = require("express");

const api = express.Router();

api.post("/", (req, res, next) => {
    res.send({ todo: true });
});

exports = module.exports = api;