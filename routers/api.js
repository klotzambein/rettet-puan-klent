const express = require("express");
const { Db } = require("mongodb");

const api = express.Router();

/** @type {Db} */
var db = null;

api.post("/", (req, res, next) => {
    db.collection('counts').count({})
        .then(() => {
            res.send('{ pageCount: ' + count + '}');
        }).catch((err) => {
            res.send(err);
        });
});

exports = module.exports = function (mongo) {
    db = mongo;
    return api;
};