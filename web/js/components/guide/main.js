main = function() {
  var courseData = [];

  function populate_courses(data) {
    // Deal with the JSON information client-side to lessen server load
    data.sort((a, b) => {
      if(a.Subject === b.Subject) {return 0}
      return a.Subject > b.Subject ? 1 : -1;
    });

    courseData = data;

    var guide = $("#guide-space");
    htmlStr = "";

    // Splits courses into subjects and renders them into clickable buttons
    // Using i as an ID ensures element uniqueness
    var prevSubject = "";
    for(var i = 0; i < courseData.length; i++) {
      var course = courseData[i];

      if(course.Subject !== prevSubject) {
        // A parent div must be closed, other than the first iteration
        if(i !== 0) htmlStr += "</div>";

        htmlStr += `<button class="subject-drop label" onclick="layout.toggle_element\
        ('subject_${i}')">${course.Subject}</button>\
        <div id="subject_${i}" style="display: none">`;

        prevSubject = course.Subject;
      }

      htmlStr += `<div class="course label" onclick="layout.toggle_element\
      ('course_info_${i}')">${course.Short}</div>`;

      htmlStr += `<div class="course-info" id="course_info_${i}" \
      style="display: none">\
      <h3 class="course-header">Course Info</h3>\
      <p><b>Full Course Name:</b> ${course.Name}</p>\
      <p><b>Description:</b> ${course.Description}</p>\
      <div class="book-drop" onclick="layout.toggle_element('books_${i}')">&#8250 Textbooks</div>\
      <div id="books_${i}" style="display: none">`;

      // Books dropdown
      var books = course.Books;
      if(!books || books.length === 0) {
        htmlStr += `<div class="book-info"><p style="margin: 0">No required textbooks</p></div>`;
      }
      // A message such as "Materials available from instructor"
      else if(typeof books === "string") {
        htmlStr += `<div class="book-info"><p style="margin: 0">${books}</p></div>`
      }
      else {
        for(var j = 0; j < books.length; j++) {
          var book = books[j];

          htmlStr += `<div class="book-info"><p><b>Book Name:</b> ${book.Name}</p>\
          <p><b>Author:</b> ${book.Author}</p>\
          <p><b>ISBN-13:</b> ${book["ISBN-13"]}</p>\
          <p><b>ISBN-10:</b> ${book["ISBN-10"]}</p>\
          <p><b>Edition/Copyright:</b> ${book["Edition/Copyright"]}</p>\
          <p><b>Publisher:</b> ${book.Publisher}</p>\
          <p><b>Requirement:</b> ${book["Requirement"]}</p>
          </div>`;
        }
      }

      htmlStr += "</div></div>"
    }

    htmlStr += "</div>";
    guide.html(htmlStr);
  }

  function init() {
    request.get("/data/courses.json", populate_courses);
  }

  return {
    init: init
  }
}();