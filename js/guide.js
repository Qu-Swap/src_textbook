guide = function() {
  var courseData;

  function populate_courses(data) {
    courseData = data;

    var guide = document.getElementById("guide-space");
    htmlStr = "";

    for(var i = 0; i < courseData.length; i++) {
      var arr = courseData[i];

      htmlStr += `<button class="subject-drop label" onclick="toggle_element('courses_${i}')">${arr[0].subjectName}</button>\
      <div id="courses_${i}" style="display: none">`;

      for(var j = 0; j < arr.length; j++) {
        var course = arr[j];

        htmlStr += `<div class="course label">${course.courseName}</div>`;
      }

      htmlStr += "</div>";
    }

    guide.innerHTML = htmlStr;
  }

  function init() {
    basic_get("getCourseData", populate_courses);
  }

  return {
    populate_courses: populate_courses,
    init: init
  }
}();