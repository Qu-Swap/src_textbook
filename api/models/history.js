module.exports = {
  // General method for inserting into history table
  insert_history: function(rows, success, table) {
    var delTime = new Date().toString();
    var e = rows[0];
    var data = [e.uuid, e.name, e.price, e.email, e.password, e.time,
    delTime, success, e.book_id, e.comment_id];

    global.db.run("INSERT INTO " + table + "_history VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data);
  }
}