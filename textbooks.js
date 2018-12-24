module.exports = {
  insert: function(bookName, isbn, author) {
      key = uuid();
      db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?)", {key, bookName, isbn, author});
  }
}
