module.exports = {
  // General method for sending buying/selling table
  get_table: function(table, callback, condition, extra) {
    if(!condition) {
      condition = "";
    }

    // Don't retrieve password, otherwise it's accessible client-side
    // Use an inner join to get the textbook and subject name
    global.db.all("SELECT a.uuid, a.name, a.price, a.email, a.book_id, a.time, b.bookName, \
     b.isbn, b.author, b.publisher, b.edition, c.subjectName, d.comment FROM " +
     table + " AS a INNER JOIN textbooks AS b INNER JOIN subjects AS c INNER JOIN \
     comments AS d ON a.book_id = b.uuid AND b.subject_id = c.uuid AND a.comment_id \
     = d.uuid " + condition + " ORDER BY a.rowid DESC", extra, (err, rows) => {
      if (err) {
        throw err;
      }

      callback(rows);
    });
  },

  // General method for inserting offers and requests
  post_entry: function(req, book_id, comment_id, hash, table) {
    return new Promise(function(resolve, reject) {
      var id = uuid();
      var name = req.body.name;
      var price = req.body.price;
      var email = req.body.email;
      var password = req.body.password;
      var time = new Date().toString();

      var data = [id, name, price, email, hash, time, book_id, comment_id];

      global.db.run("INSERT INTO " + table + " VALUES(?, ?, ?, ?, ?, ?, ?, ?)", data, () => {
        resolve();
      });
    });
  }
}