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
app.use(bodyParser.urlencoded({extended: true}));

// Static elements
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/sell.html", express.static(__dirname + "/sell.html"));
app.use("/buy.html", express.static(__dirname + "/buy.html"));

// Send homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/welcome.html");
});

// Middleware function for getting sell data
function get_sell_data(req, res) {
  db.all("SELECT name, bookName, isbn, price, email FROM sellers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
          console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
  });
}

// Middleware function for getting buy data
function get_buy_data(req, res) {
  db.all("SELECT name, bookName, isbn, price, email FROM buyers", (err, rows) => {
      if (err){
        throw err;
      }
      rows.forEach(function (row) {
          console.log(row.name, row.bookName, row.isbn, row.price, row.email);
      });
      res.send(rows);
  });
}

// GET request for getting selling data
app.get("/getSellData", get_sell_data);

// GET request for getting buying data
app.get("/getBuyData", get_buy_data);

// POST request for inserting sell data
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

// POST request for inserting buy data
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

// POST request for deleting sell data
app.post('/deleteSellData', function(req, res) {
  var rowid = req.body.rowid;
  var password = req.body.password;

  db.all("SELECT password FROM sellers WHERE rowid = " + rowid.toString(), (err, rows) => {
    if (err){
      throw err;
    }

    if(password === rows[0].password) {
      db.run("DELETE FROM sellers WHERE rowid = " + rowid.toString());
      db.run("UPDATE sellers SET rowid = rowid - 1 WHERE rowid > " + rowid.toString());
      db.all("SELECT name, bookName, isbn, price, email FROM sellers", (err, rows) => {
          if (err){
            throw err;
          }
          rows.forEach(function (row) {
              console.log(row.name, row.bookName, row.isbn, row.price, row.email);
          });
          res.send(rows);
      });
    }
    else {
      res.send();
    }

  });
})

// Listen on the server
server.listen(8080, function() {
  console.log("Server running on port 8080.")
});
