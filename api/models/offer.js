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
  // Get the entire row for a specific entry
  get_full_single: function(uuid, table, callback) {
    global.db.all("SELECT * FROM " + table + " WHERE uuid = (?)", [uuid], (err, rows) => {
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
  },
  // General method for searching one of the sell/buy tables based on a query
  search_table: function(req, table, callback) {
    var query = req.body.query;
    var condition = "AND (a.name || b.bookName || b.author || c.subjectName LIKE \
    (?) OR b.isbn = (?))";

    this.get_table(table, callback, condition, ['%' + query + '%', query]);
  },
  // General method for looking up entry details based on uuid
  search_table_details: function(uuid, table, callback) {
    var condition = "AND a.uuid = (?)";

    this.get_table(table, callback, condition, [uuid]);
  },
  // General method for offer deletion
  delete_entry: function(uuid, table, callback) {
    global.db.run("DELETE FROM " + table + " WHERE uuid = (?)", [uuid], () => {
      callback();
    });
  }
}