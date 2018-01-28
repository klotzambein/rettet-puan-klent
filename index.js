const express = require('express');
const morgan = require('morgan');
const mongo = require('./util/mongo')
const parser = require('body-parser');

mongo.initDb().catch((err) => { throw err; });

const app = express();

app.use(morgan("dev"));
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.use(express.static("www"));
app.use("/api", require("./routers/api")(mongo));


// port and ip
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
//listen
app.listen(port, ip);
console.log("listening on " + ip + ":" + port);

module.exports = app;