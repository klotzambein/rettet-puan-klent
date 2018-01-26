const express = require('express');

const app = express();

app.use(express.static("www"));
app.use("/api", require("./routers/api"));

app.listen(8080);