// Imports
var subjects = require("./subjects");
var courses = require("./courses");

// First synchronously load subject data
function sync_subjects() {
  return new Promise(function(resolve, reject) {
    global.db.run("CREATE TABLE subjects(uuid NOT NULL PRIMARY KEY, subjectName TEXT)", (err) => {
      if (err) {
        reject();
      }
      else {
        subjects.insert_subjects(global.path + "subjects.csv");
        resolve();
      }
    });
  });
}

var errHandler = function(err) {}

module.exports = {
  setup: function() {
    // Generate tables, ignore an error if the table already exists
    var subjectPromise = sync_subjects(global.db);

    subjectPromise.then(() => {
      // Queries here will be serialized
      global.db.serialize(() => {

        global.db.run("CREATE TABLE courses(uuid NOT NULL PRIMARY KEY, courseName TEXT, \
        shortName TEXT, link TEXT, subject_id, FOREIGN KEY (subject_id) REFERENCES subjects(uuid))",
        (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE course_requirements(course_id, predicate TEXT, book_id, \
        FOREIGN KEY (course_id) REFERENCES courses(uuid), FOREIGN KEY (book_id) REFERENCES \
        textbooks(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE textbooks(uuid NOT NULL PRIMARY KEY, bookName \
        TEXT, isbn TEXT, author TEXT, publisher TEXT, edition INTEGER, subject_id, \
        FOREIGN KEY (subject_id) REFERENCES subjects(uuid))", (err) =>{
          if (err){}
          else {
            // Populate courses and their respective textbooks
            courses.populate(global.path + "courses.json");
          }
        });

        global.db.run("CREATE TABLE sellers(uuid NOT NULL PRIMARY KEY, name TEXT, \
        price DOUBLE, email TEXT, password TEXT, book_id, comment_id, FOREIGN KEY \
        (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE buyers(uuid NOT NULL PRIMARY KEY, name TEXT, \
        price DOUBLE, email TEXT, password TEXT, book_id, comment_id, FOREIGN KEY \
        (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE comments(uuid NOT NULL PRIMARY KEY, comment TEXT)", (err) => {
          if(err){}
        });

        global.db.run("PRAGMA foreign_keys = ON", (err) => {
          if (err){}

          console.log('Connected to the database.');
        });
      });
    }, errHandler);
  }
}