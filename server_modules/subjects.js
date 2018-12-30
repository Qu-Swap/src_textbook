var fs = require("fs");

module.exports = {
  // Inserts subjects into database, doing this synchronously is OK
  insert_subjects: function(path) {
    var subjectArr = fs.readFileSync(path).toString().split("\n");

    for(var i = 0; i < subjectArr.length; i++) {
      global.db.run("INSERT INTO subjects VALUES(?, ?)",
      [global.uuid(), subjectArr[i]]);
    }
  },
  get_subjects: function(req, res) {
    global.db.all("SELECT * FROM SUBJECTS", (err, rows) => {
      if(err) {
        throw err;
      }

      res.send(rows);
    });
  }
}
