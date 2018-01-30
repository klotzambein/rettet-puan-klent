const express = require("express");
const { Db } = require("mongodb");

const api = express.Router();

/** @type {{getDb:() => Db, initDb: () => Promise.<Bd>}} */
var dbModule = null;

function testEmail(email) {
    var x = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    return x;
}

api.get("/count", (req, res, next) => {
    dbModule.getDb().collection('emails').count({})
        .then((count) => {
            res.send({ count: count });
        }).catch((err) => {
            res.send(err);
        });
});
api.post("/add", (req, res, next) => {
    if (!req.body.email)
        return res.send({ error: "email not set" });
    var email = req.body.email;
    if (typeof email !== 'string')
        return res.send({ error: "not a string" });
    if (!testEmail(email.trim()))
        return res.send({ error: "not a valid email" });

    dbModule.getDb().collection('emails').insertOne({ email: email.trim() })
        .catch((err) => {
            res.send({ error: err });
        }).then((result) => {
            res.send({ ok: true });
        });
});
api.get("/list", (req, res, next) => {
    dbModule.getDb().collection('emails').find({ email: { $exists: true } }).toArray()
        .catch((err) => {
            res.send({ error: err });
        })
        .then((arr) => {
            res.send({ emails: arr });
        });
});

api.use((err, req, res, next) => {
    res.send({ error: err });
});

exports = module.exports = function (mongo) {
    dbModule = mongo;
    return api;
};