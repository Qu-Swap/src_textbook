// Objects
var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");
const uuid = require("uuid/v1");

// Path to database files
var path = __dirname + "/data/";

// Open database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(path + "offers.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run("CREATE TABLE sellers(uuid NOT NULL PRIMARY KEY, name TEXT, bookName TEXT, isbn TEXT, price DOUBLE, email TEXT, password TEXT)", (err) =>{
    if (err){}
  });
  db.run("CREATE TABLE buyers(uuid NOT NULL PRIMARY KEY, name TEXT, bookName TEXT, isbn TEXT, price DOUBLE, email TEXT, password TEXT)", (err) =>{
    if (err){}
  });
  db.run("CREATE TABLE textbooks(uuid NOT NULL PRIMARY KEY, name TEXT, isbn TEXT, author TEXT)", (err) =>{
    if (err){}
  });
});

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static elements
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/", express.static(__dirname + "/html"));

// Send homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/welcome.html");
});

// General method for sending buying/selling table
function get_table(req, res, table) {
  db.all("SELECT uuid, name, bookName, isbn, price, email FROM " + table, (err, rows) => {
      if (err) {
        throw err;
      }

      res.send(rows);
  });
}

// General method for inserting data
function post_entry(req, res, table) {
  var id = uuid();
  var name = req.body.name;
  var bookName = req.body.bookName;
  var isbn = req.body.isbn;
  var price = req.body.price;
  var email = req.body.email;
  var password = req.body.password;
  var data = [id, name, bookName, isbn, price, email, password];

  db.run("INSERT INTO " + table + " VALUES(?, ?, ?, ?, ?, ?, ?)", data);
  get_table(req, res, table);
}

// General method for deleting data
function delete_entry(req, res, table) {
  var id = req.body.id;
  var password = req.body.password;

  db.all("SELECT password FROM " + table + " WHERE uuid = \"" + id +"\"", (err, rows) => {
    if (err) {
      throw err;
    }

    if(password === rows[0].password) {
      db.run("DELETE FROM " + table + " WHERE uuid = \"" + id + "\"");

      get_table(req, res, table);
    }
    else {
      res.send();
    }
  });
}

// GET request for getting selling data
app.get("/getSellData", function(req, res) {
  get_table(req, res, "sellers");
});

// GET request for getting buying data
app.get("/getBuyData", function(req, res) {
  get_table(req, res, "buyers");
});

// POST request for inserting sell data
app.post("/postSellData", function(req, res) {
  post_entry(req, res, "sellers");
});

// POST request for inserting buy data
app.post("/postBuyData", function(req, res) {
  post_entry(req, res, "buyers");
});

// DELETE request for deleting sell data
app.delete('/deleteSellData', function(req, res) {
  delete_entry(req, res, "sellers");
});

// DELETE request for deleting buy data
app.delete('/deleteBuyData', function(req, res) {
  delete_entry(req, res, "buyers");
});

// Listen on the server
server.listen(8080, function() {
  console.log("Server running on port 8080.")
});
