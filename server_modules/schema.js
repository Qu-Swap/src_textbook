// Imports
var subjects = require("./subjects");
var courses = require("./courses");

/* An error means that the database has already been populated, and so we can
connect immediately */
var errHandler = function(err) {
  console.log('Connected to the database.');
}

module.exports = {
  setup: function() {
    // Generate tables, ignore an error if the table already exists
    subjects.create_table().then(() => {
      return subjects.insert_subjects(global.path + "subjects.csv");
    }).then(() => {
      global.db.serialize(() => {
        // Queries here will be serialized
        global.db.run("CREATE TABLE courses(uuid NOT NULL PRIMARY KEY, courseName TEXT, \
        shortName TEXT, description TEXT, link TEXT, subject_id, FOREIGN KEY (subject_id) \
        REFERENCES subjects(uuid))",
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
        price DOUBLE, email TEXT, password TEXT, time TEXT, book_id, comment_id, FOREIGN KEY \
        (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE buyers(uuid NOT NULL PRIMARY KEY, name TEXT, \
        price DOUBLE, email TEXT, password TEXT, time TEXT, book_id, comment_id, FOREIGN KEY \
        (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE sellers_history(uuid NOT NULL PRIMARY KEY, name TEXT, \
        price DOUBLE, email TEXT, password TEXT, time TEXT, delTime TEXT, success INTEGER, book_id, \
        comment_id, FOREIGN KEY (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE buyers_history(uuid NOT NULL PRIMARY KEY, name TEXT, \
        price DOUBLE, email TEXT, password TEXT, time TEXT, delTime TEXT, success INTEGER, book_id, \
        comment_id, FOREIGN KEY (book_id) REFERENCES textbooks(uuid), FOREIGN KEY (comment_id) REFERENCES \
        comments(uuid))", (err) => {
          if (err){}
        });

        global.db.run("CREATE TABLE comments(uuid NOT NULL PRIMARY KEY, comment TEXT)", (err) => {
          if(err){}

          console.log("Connected to the database.");
        });
      });
    }, errHandler);
  }
}