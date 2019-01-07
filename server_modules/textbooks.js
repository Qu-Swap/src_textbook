var fs = require("fs");

// Insert a book found from json data
function insert_json_book(book, course) {
  // First check if the book already exists
  global.db.all("SELECT * FROM textbooks WHERE isbn = '" + book["ISBN-13"] + "'\
  OR isbn = '" + book["ISBN-10"] + "'", (err, rows) => {
    if(err){}
    // If no books have this isbn
    if(rows.length === 0) {
      var id = global.uuid();
      var bookName = book["Name"];
      var isbn = book["ISBN-13"] ? book["ISBN-13"] : book["ISBN-10"];
      var author = book["Author"];
      var publisher = book["Publisher"];
      var edition = book["Edition/Copyright"];
      var subject_id;

      global.db.all("SELECT uuid FROM subjects WHERE subjectName = '" +
      course["Subject"] + "'", (err, rows) => {
        if(err){}

        subject_id = rows[0]["uuid"];
        var data = [id, bookName, isbn, author, publisher, edition, subject_id];

        global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?, ?, ?, ?)", data);
      });
    }
  });
}

module.exports = {
  // Pre-populate textbooks table with required ones for courses, synchronous is ok
  populate: function(path) {
    var file = fs.readFileSync(path);
    var courses = JSON.parse(file);

    for(var i = 0; i < courses.length; i++) {
      var books = courses[i]["Books"];

      if(books && typeof books === "object") {
        for(var j = 0; j < books.length; j++) {
          var book = books[j];

          insert_json_book(book, courses[i]);
        }
      }
    }
  },
  get_table: function(req, res) {
    global.db.all("SELECT * FROM textbooks", (err, rows) => {
        if (err) {
          throw err;
        }

        res.send(rows);
    });
  },
  insert: function(req, res) {
    var id = global.uuid();
    var bookName = req.body.bookName;
    var isbn = req.body.isbn;
    var author = req.body.author;
    var publisher = "temp";
    var edition = 0;
    var subject_id = req.body.subject_id;
    var data = [id, bookName, isbn, author, publisher, edition, subject_id];

    global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?, ?, ?, ?)", data);

    return id;
  },
  search: function(req, res) {
    var query = req.body.query;

    global.db.all("SELECT a.*, b.subjectName FROM textbooks as a INNER JOIN \
    subjects as b ON (a.bookName LIKE '%" + query + "%' OR a.author LIKE '%" +
    query + "%' OR a.isbn = '" + query + "' OR b.subjectName LIKE '%" + query
    + "%') AND a.subject_id = b.uuid", (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  }
};
