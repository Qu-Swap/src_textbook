module.exports = {
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
    var subject_id = req.body.subject_id;
    var data = [id, bookName, isbn, author, subject_id];

    global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?, ?)", data);

    return id;
  },
  search_name: function(req, res) {
    global.db.all("SELECT * FROM textbooks WHERE \
    bookName LIKE '%" + req.body.bookName +"%'", (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  },
  search_author: function(req, res) {
    global.db.all("SELECT * FROM textbooks WHERE \
    author LIKE '%" + req.body.author +"%'", (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  },
  search_isbn: function(req, res) {
    global.db.all("SELECT * FROM textbooks WHERE \
    isbn = '" + req.body.isbn + "'", (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  }
};
