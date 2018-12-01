// Objects
var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");

// Path to sellOffers.json file
var path = __dirname + "/data/sellOffers.json";

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// Static elements
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/sell.html", express.static(__dirname + "/sell.html"));

// Send selling homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/welcome.html");
});

// GET request for getting data
app.get("/getData", function(req, res) {
  fs.readFile(path, "utf8", function(err, data) {
    console.log(data);
    res.send(data);
  });
});

// POST request for insertion
app.post("/postData", function(req, res) {
  var name = req.body.name;
  var bookName = req.body.bookName;
  var price = req.body.price;

  fs.readFile(path, "utf8", function(err, data) {
    data = JSON.parse(data);
    data.push({"name": name, "bookName": bookName, "price": price});
    console.log(data);
    res.send(data);

    fs.writeFile(path, JSON.stringify(data), "utf8", function(err) {
      res.end();
    });
  });
});

// Listen on the server
server.listen(8081, function() {
  console.log("Server running on port 8081.")
});
