var fs = require("fs");

/* Function to manage setting up callbacks for insertion, this is needed otherwise
the loop variables aren't saved due to async */
function manage_json_data(course, books) {
  var subject_id;

  global.db.all("SELECT uuid FROM subjects WHERE subjectName = '" +
  course["Subject"] + "'", (err, rows) => {
    if(err){}
    subject_id = rows[0]["uuid"];

    var course_id = insert_json_course(course, subject_id);

    if(books && typeof books === "object") {
      for(var j = 0; j < books.length; j++) {
        var book = books[j];

        var bookPromise = insert_json_book(book, subject_id);
        bookPromise.then(function(res) {
          insert_json_connnection(course_id, res, book);
        }, function(err) {});
      }
    }
  });
}

// Insert a course found from json data
function insert_json_course(course, subject_id) {
  var id = global.uuid();
  var name = course["Name"];
  var short = course["Short"];
  var link = course["Link"];
  var data = [id, name, short, link, subject_id];

  global.db.run("INSERT INTO courses VALUES(?, ?, ?, ?, ?)", data);

  return id;
}

// Insert a book found from json data
function insert_json_book(book, subject_id) {
  return new Promise(function(resolve, reject) {
    // First check if the book already exists
    global.db.all("SELECT * FROM textbooks WHERE isbn = '" + book["ISBN-13"] + "'\
    OR isbn = '" + book["ISBN-10"] + "'", (err, rows) => {
      if(err) {
        reject();
      }
      // If no books have this isbn
      if(rows.length === 0) {
        var id = global.uuid();
        var bookName = book["Name"];
        var isbn = book["ISBN-13"] ? book["ISBN-13"] : book["ISBN-10"];
        var author = book["Author"];
        var publisher = book["Publisher"];
        var edition = book["Edition/Copyright"];
        var data = [id, bookName, isbn, author, publisher, edition, subject_id];

        global.db.run("INSERT INTO textbooks VALUES(?, ?, ?, ?, ?, ?, ?)", data);

        resolve(id);
      }
      // Else send the id of the already inserted book
      else {
        resolve(rows[0]["uuid"]);
      }
    });
  });
}

// Insert a connection between book and course
function insert_json_connnection(course_id, book_id, book) {
  var predicate = book["Requirement"] === "Required" ? "requires" : "recommends";
  var data = [course_id, predicate, book_id];

  global.db.run("INSERT INTO course_requirements VALUES (?, ?, ?)", data);
}

module.exports = {
  /* Pre-populate textbooks/courses table from scraped JSON information,
  synchronous is ok */
  populate: function(path) {
    var file = fs.readFileSync(path);
    var courses = JSON.parse(file);

    for(var i = 0; i < courses.length; i++) {
      var course = courses[i];

      manage_json_data(course, course["Books"]);
    }
  }
}