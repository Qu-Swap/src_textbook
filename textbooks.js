module.exports = {
  get_table: function(req, res) {
    global.db.all("SELECT * from textbooks", (err, rows) => {
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
    var data = [id, bookName, isbn, author];

    global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?)", data);

    return id;
  }
};
