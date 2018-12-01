// Objects
var express = require("express");
var app = express();
var server = require("http").Server(app);
var fs = require("fs");

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

db.parallelize(() => {
  // Queries scheduled here will be serialized.
  db.run("CREATE TABLE sellers(name TEXT, bookName TEXT, isbn TEXT, price DOUBLE, email TEXT, password TEXT)", (err) =>{
    if (err){}
  });
  db.run("CREATE TABLE buyers(name TEXT, bookName TEXT, isbn TEXT, price DOUBLE, email TEXT, password TEXT)", (err) =>{
    if (err){}
  });
});

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// Static elements
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/sell.html", express.static(__dirname + "/sell.html"));
app.use("/buy.html", express.static(__dirname + "/buy.html"));

// Send homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/welcome.html");
});

// GET request for getting selling data
app.get("/getSellData", function(req, res) {
  db.all("SELECT name, bookName, isbn, price, email FROM sellers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
          console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
  });
});

// GET request for getting buying data
app.get("/getBuyData", function(req, res) {
  db.all("SELECT name, bookName, isbn, price, email FROM buyers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
          console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
  });
});

// app.get("/getDatabuy", function(req, res) {
//   db.all("SELECT name, book, isbn, price, email FROM buyers", (err, rowss) => {
//       if (err){
//         throw err;
//       }
//       rowss.forEach(function (row) {
//           console.log(row.name, row.book, row.isbn, row.price, row.email);
//       });
//       res.send(rowss);
//   });
// });

// POST request for insertion
app.post("/postSellData", function(req, res) {
  var name = req.body.name;
  var bookName = req.body.bookName;
  var isbn = req.body.isbn;
  var price = req.body.price;
  var email = req.body.email;
  var password = req.body.password;
  var data = [name, bookName, isbn, price, email, password];
  db.run("INSERT INTO sellers(name, bookName, isbn, price, email, password) VALUES(?, ?, ?, ?, ?, ?)", data);
  db.all("SELECT name, bookName, isbn, price, email FROM sellers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
        console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
    });
});

// POST request for insertion
app.post("/postBuyData", function(req, res) {
  var name = req.body.name;
  var bookName = req.body.bookName;
  var isbn = req.body.isbn;
  var price = req.body.price;
  var email = req.body.email;
  var password = req.body.password;
  var data = [name, bookName, isbn, price, email, password];
  db.run("INSERT INTO buyers(name, bookName, isbn, price, email, password) VALUES(?, ?, ?, ?, ?, ?)", data);
  db.all("SELECT name, bookName, isbn, price, email FROM buyers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
        console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
    });
});

// Listen on the server
server.listen(8080, function() {
  console.log("Server running on port 8081.")
});
