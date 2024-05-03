const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const mysql = require("mysql");

const app = express();
const port = 5000;

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

exports.db = mysql.createConnection({
  host: "tangjaikonlakan.online",
  user: "demo",
  password: "17vlwH5*",
  database: "demo",
});

const files = fs.readdirSync("./Routes");
files.map((r) => {
  const route = require("./Routes/" + r);
  app.use("/api", route);
});

app.listen(port, () => {
  console.log(`Runing is Server on Port ${port}`);
});
