// Objects
const express = require("express");
var app = express();
var server = require("http").Server(app);
global.uuid = require("uuid/v4");

// Path to database files
global.path = __dirname + "/data/";

// Imports
var textbooks = require("./api/models/textbook");
var subjects = require("./api/models/subjects");
var courses = require("./api/models/courses");
var comments = require("./api/models/comments");
var schema = require("./api/models/schema");
var passmod = require("./api/models/password")

// Open database
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database(global.path + "offers.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }

  // Setup schema
  schema.setup();
});

// Middleware and controllers
app.use(require("./api/controllers"));

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static elements
app.use("/css", express.static(__dirname + "/web/css"));
app.use("/js", express.static(__dirname + "/web/js"));
app.use("/media", express.static(__dirname + "/web/media"));
app.use("/data/courses.json", express.static(__dirname + "/data/courses.json"));
app.use("/", express.static(__dirname + "/web/views/"));

// Send homepage
app.get("/index.html", function(req, res) {
  res.sendFile(__dirname + "/web/views/static/welcome.html");
});

// Remove HTML tags
app.use(function(req, res, next) {
  for(var key in req.body) {
    if(!req.body.hasOwnProperty(key)) continue;

    req.body[key] = req.body[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  next();
});

// General method for searching one of the sell/buy tables based on a query
function search_table(req, res, table) {
  var query = req.body.query;
  var condition = "AND (a.name || b.bookName || b.author || c.subjectName LIKE \
  (?) OR b.isbn = (?))";

  get_table(req, res, table, condition, ['%' + query + '%', query]);
}

// General method for looking up entry details based on uuid
function search_table_details(req, res, table) {
  var condition = "AND a.uuid = (?)";

  get_table(req, res, table, condition, [req.body.query]);
}

// General method for deleting data
function delete_entry(req, res, table) {
  var id = req.body.id;
  var password = req.body.password;
  var success = req.body.success === '1' ? 1 : 0;

  global.db.all("SELECT * FROM " + table + " WHERE uuid = (?)", [id], (err, rows) => {
    if (err) {
      throw err;
    }

    // If the offer was deleted already or user manipulated ID
    if(rows.length === 0) {
      res.sendStatus(269); // Give the user a message that the offer does not exist :^)
    }
    else {
      passmod.verify(password, rows[0].password).then(function(result) {
        if(result) {
          global.db.run("DELETE FROM " + table + " WHERE uuid = (?)", [id], () => {
            get_table(req, res, table);
          });

          // Move to respective history table
          var delTime = new Date().toString();
          var e = rows[0];
          var data = [e.uuid, e.name, e.price, e.email, e.password, e.time,
          delTime, success, e.book_id, e.comment_id];

          global.db.run("INSERT INTO " + table + "_history VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data);
        }
        else {
          res.send();
        }
      });
    }
  });
}

// GET request for getting textbook data
app.get("/getTextbookData", textbooks.get_table);

// GET request for getting a list of subjects
app.get('/getSubjects', subjects.get_subjects);

// POST request for deleting sell data
app.post('/deleteSellData', function(req, res) {
  delete_entry(req, res, "sellers");
});

// POST request for deleting buy data
app.post('/deleteBuyData', function(req, res) {
  delete_entry(req, res, "buyers");
});

// POST request for searching textbooks
app.post('/postSearchData', textbooks.search);

// POST request for getting details for a selling offer
app.post('/postDetailsSellingOffers', function(req, res) {
  search_table_details(req, res, "sellers");
});

// POST request for getting details for a buying offer
app.post('/postDetailsBuyingOffers', function(req, res) {
  search_table_details(req, res, "buyers");
});

// POST request for searching the sell table
app.post('/postSearchSellingOffers', function(req, res) {
  search_table(req, res, "sellers");
});

// POST request for searching the buy table
app.post('/postSearchBuyingOffers', function(req, res) {
  search_table(req, res, "buyers");
});

// POST request for getting tags for a certain book
app.post('/postBookTags', textbooks.get_tags);

// Listen on the server
server.listen(8085, function() {
  console.log("Server running on port 8085.")
});
