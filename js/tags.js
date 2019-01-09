tags = function() {
  function populate_element(elName, data) {
    var el = document.getElementById(elName);
    var htmlStr = "<ul class='tags'>";

    for(tag of data) {
      var req = tag["predicate"] === "requires" ? "Required" : "Recommended";
      htmlStr += "<li>" + req + " " + tag["shortName"] + "</li";
    }
    htmlStr += "</ul>"

    el.innerHTML = htmlStr;
  }

  function populate_tags(bookId, elName) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        populate_element(elName, data);
      }
    }

    var dataStr = "uuid=" + bookId;
    ajax.open("POST", "/postBookTags", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(dataStr);
  }

  return {
    populate_tags: populate_tags
  }
}();