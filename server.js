// Objects
const express = require("express");
var app = express();
var server = require("http").Server(app);
global.uuid = require("uuid/v4");

// Path to database files
global.path = __dirname + "/data/";

// Imports
var Schema = require("./api/models/schema");

// Open database
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database(global.path + "offers.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }

  // Setup schema
  Schema.setup();
});

// Middleware and controllers
app.use(require("./api/middlewares"));
app.use(require("./api/controllers"));

// Static elements
app.use("/css", express.static(__dirname + "/web/css"));
app.use("/js", express.static(__dirname + "/web/js"));
app.use("/media", express.static(__dirname + "/web/media"));
app.use("/data/courses.json", express.static(__dirname + "/data/courses.json"));
app.use("/", express.static(__dirname + "/web/views/"));
app.use("/", express.static(__dirname + "/web/views/static"));

// Send homepage
app.get("/index.html", function(req, res) {
  res.sendFile(__dirname + "/web/views/static/welcome.html");
});

// Listen on the server
server.listen(8085, function() {
  console.log("Server running on port 8085.")
});
