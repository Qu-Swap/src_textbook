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
    return new Promise(function(resolve, reject) {
      // If the book_id is not empty, then the user has selected an existing book
      if(req.body.book_id) {
        resolve(req.body.book_id);
        return;
      }

      var id = global.uuid();
      var bookName = req.body.bookName;
      var isbn = req.body.isbn;
      var author = req.body.author;
      var publisher = req.body.publisher;
      var edition = req.body.edition;
      var subject_id = req.body.subject_id;
      var data = [id, bookName, isbn, author, publisher, edition, subject_id];

      global.db.all("SELECT * FROM textbooks WHERE isbn = (?)", isbn, (err, rows) => {
        if(err) {
          reject();
          return;
        }

        /* If the book already exists (same ISBN), then force the user to choose
        that one */
        if(rows.length > 0) {
          resolve(rows[0].uuid);
        }
        else {
          global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?, ?, ?, ?)", data, () => {
            resolve(id);
          });
        }
      });
    });
  },
  search: function(req, res) {
    var query = req.body.query;

    global.db.all("SELECT a.rowid, a.*, b.subjectName FROM textbooks as a INNER JOIN \
    subjects as b ON a.bookName || a.author || a.isbn || b.subjectName LIKE (?) \
    AND a.subject_id = b.uuid UNION SELECT a.rowid, a.*, b.subjectName FROM \
    textbooks as a INNER JOIN subjects as b INNER JOIN course_requirements as c \
    INNER JOIN courses as d ON 'Required ' || d.shortName || 'Recommended ' || \
    d.shortName || d.courseName LIKE (?) AND d.uuid = \
    c.course_id AND a.uuid = c.book_id AND a.subject_id = b.uuid ORDER BY \
    a.rowid", ['%' + query + '%', '%' + query + '%'], (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  },
  get_tags: function(req, res) {
    global.db.all("SELECT a.predicate, b.shortName, b.courseName FROM \
    course_requirements AS a INNER JOIN courses AS b ON a.course_id = b.uuid \
    AND a.book_id = (?)", [req.body.uuid], (err, rows) => {
      if(err) {}

      res.send(rows);
    });
  }
};
