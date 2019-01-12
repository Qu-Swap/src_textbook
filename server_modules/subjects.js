var fs = require("fs");

module.exports = {
  // Creates the table, making this a separate function improves readability
  create_table: function() {
    return new Promise(function(resolve, reject) {
      global.db.run("CREATE TABLE subjects(uuid NOT NULL PRIMARY KEY, subjectName TEXT)", (err) => {
        if (err) {
          reject();
          return;
        }
        resolve();
      });
    });
  },
  // Inserts subjects into database, doing this synchronously is OK
  insert_subjects: function(path) {
    return new Promise(function(resolve, reject) {
      var subjectArr = fs.readFileSync(path).toString().split("\n");
      var loaded = 0;

      for(var i = 0; i < subjectArr.length; i++) {
        global.db.run("INSERT INTO subjects VALUES(?, ?)",
        [global.uuid(), subjectArr[i]], (err) => {
          if(err) {
            reject();
            return;
          }

          // If all subjects have been inserted, continue with the database population
          loaded++;
          if(loaded === subjectArr.length - 1) {
            resolve();
          }
        });
      }
    });
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
