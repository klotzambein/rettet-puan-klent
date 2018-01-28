const express = require("express");
const { Db } = require("mongodb");

const api = express.Router();

/** @type {{getDb:() => Db, initDb: () => Promise.<Bd>}} */
var dbModule = null;

var emailTest = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.compile();
function testEmail(email) {
    return emailTest.test(email);
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
    if (req.body.email) {
        var email = req.body.email.trim();
        if (testEmail(email))
            dbModule.getDb().collection('emails').insertOne({ email: email })
                .catch((err) => {
                    res.send({ error: err });
                }).then((result) => {
                    res.send({ ok: true });
                });
        else
            res.send({ error: "not a valid email" });
    }
    else
        res.send({ error: "email not set" });
});
api.get("/list", (req, res, next) => {
    dbModule.getDb().collection('emails').find({}).toArray()
        .catch((err) => {
            res.send({ error: err });
        })
        .then((arr) => {
            res.send({ emails: arr });
        });
});

api.use((err, req, res, next) => {
    res.send({ error: String.toString(err) });
});

exports = module.exports = function (mongo) {
    dbModule = mongo;
    return api;
};