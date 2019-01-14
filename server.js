// Objects
var express = require("express");
var app = express();
var server = require("http").Server(app);
global.uuid = require("uuid/v4");

// Path to database files
global.path = __dirname + "/data/";

// Imports
var textbooks = require("./server_modules/textbooks");
var subjects = require("./server_modules/subjects");
var comments = require("./server_modules/comments");
var schema = require("./server_modules/schema");
var passmod = require("./server_modules/password")

// Open database
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database(global.path + "offers.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }

  // Setup schema
  schema.setup();
});

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static elements
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/media", express.static(__dirname + "/media"));
app.use("/", express.static(__dirname + "/html"));

// Send homepage
app.get("/index.html", function(req, res) {
  res.sendFile(__dirname + "/html/welcome.html");
});

// Remove HTML tags
app.use(function(req, res, next) {
  for(var key in req.body) {
    if(!req.body.hasOwnProperty(key)) continue;

    req.body[key] = req.body[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  next();
});

// General method for sending buying/selling table
function get_table(req, res, table, condition) {
  if(!condition) {
    condition = "";
  }

  // Don't retrieve password, otherwise it's accessible client-side
  // Use an inner join to get the textbook and subject name
  global.db.all("SELECT a.uuid, a.name, a.price, a.email, a.book_id, a.time, b.bookName, \
   b.isbn, b.author, b.publisher, b.edition, c.subjectName, d.comment FROM " +
   table + " AS a INNER JOIN textbooks AS b INNER JOIN subjects AS c INNER JOIN \
   comments AS d ON a.book_id = b.uuid AND b.subject_id = c.uuid AND a.comment_id \
   = d.uuid " + condition + " ORDER BY a.rowid DESC", (err, rows) => {
    if (err) {
      throw err;
    }

    res.send(rows);
  });
}

// General method for searching one of the sell/buy tables based on a query
function search_table(req, res, table) {
  var query = req.body.query;
  var condition = "AND (a.name || b.bookName || b.author || c.subjectName LIKE \
  '%" + query + "%' OR b.isbn = '" + query + "')";

  get_table(req, res, table, condition);
}

// General method for looking up entry details based on uuid
function search_table_details(req, res, table) {
  var condition = "AND a.uuid = \"" + req.body.query + "\"";

  get_table(req, res, table, condition);
}

// General method for inserting data
function post_entry(req, res, table) {
  /* These should be serialized, otherwise there is a race betweeen inserting
  into buyers/sellers and textbooks */
  global.db.serialize(() => {
    var id = uuid();
    var name = req.body.name;
    var price = req.body.price;
    var email = req.body.email;
    var password = req.body.password;
    var time = new Date().toString();
    var book_id = req.body.book_id;
    var comment_id = comments.insert(req, res);

    // If the book_id is empty, then the user is inserting a new textbook
    if(!book_id) {
      book_id = textbooks.insert(req, res);
    }

    passmod.hash_salt(password).then(function(hash) {
      var data = [id, name, price, email, hash, time, book_id, comment_id];

      global.db.run("INSERT INTO " + table + " VALUES(?, ?, ?, ?, ?, ?, ?, ?)", data, () => {
        get_table(req, res, table);
      });
    });
  });
}

// General method for deleting data
function delete_entry(req, res, table) {
  var id = req.body.id;
  var password = req.body.password;

  global.db.all("SELECT password FROM " + table + " WHERE uuid = \"" + id +"\"", (err, rows) => {
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
          global.db.run("DELETE FROM " + table + " WHERE uuid = \"" + id + "\"", () => {
            get_table(req, res, table);
          });
        }
        else {
          res.send();
        }
      });
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

// GET request for getting textbook data
app.get("/getTextbookData", textbooks.get_table);

// POST request for inserting sell data
app.post("/postSellData", function(req, res) {
  post_entry(req, res, "sellers");
});

// POST request for inserting buy data
app.post("/postBuyData", function(req, res) {
  post_entry(req, res, "buyers");
});

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

// GET request for getting a list of subjects
app.get('/getSubjects', subjects.get_subjects);

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
