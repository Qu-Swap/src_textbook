// Put these into a single object someday
var sellData;
var buyData;
var subjectData;
var queriedBookData;

var loaded;

/* Function to request data from the server, it currently waits before
all responses are received before populating the html elements. This is done
in case in the future elements will need data from multiple responses. As a
result, the variable loaded keeps track of the number of responses received.
Once it hits 3, we know that was the last response, and the elements can be
populated */
function requestData(getReq, elementID) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      // Will make this a separate function someday as this code gets reused
      // Will also make it better
      var data = JSON.parse(ajax.responseText);
      switch(elementID) {
        case "sellTable":
          sellData = data;
          break;
        case "buyTable":
          buyData = data;
          break;
        case "subjectDown":
          subjectData = data;
          subjectID = subjectData[0]["uuid"];
          break;
      }

      loaded++;

      // If all data has been loaded (indicating this is the last response)
      if(loaded === TOTALASSETS) {
        loadTableData("sellTable");
        loadTableData("buyTable");
        loadSelectData("subjectDown");
      }
    }
  }

  ajax.open("GET", getReq, true);
  ajax.send();
}

function getData(getReq, elementID) {
  try {
    requestData(getReq, elementID);
  }
  catch(e) {
    alert("Error getting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}

// Creates multiple tables in a div element to show buying/selling offers
function loadTableData(tableID) {
  var data;
  (tableID == "sellTable") ?
  data = sellData :
  data = buyData

  var table = document.getElementById(tableID);
  var htmlStr = ""

  if(data.length > 0) {
    var prevSubject;

    for(var i = 0; i < data.length; i++) {
      var currentEntry = data[i];
      if(currentEntry["subjectName"] != prevSubject) {
        prevSubject = currentEntry["subjectName"];
        htmlStr += "</table></div>\
        <button class='dropDown' \
        onclick=\"toggle_element('" + prevSubject + "')\">" +
        prevSubject + "</button><div style='display: none;'\
        id=\"" + prevSubject + "\"> \
        <table class=\"table table-striped table-bordered\">";

        (tableID === "sellTable") ?
        htmlStr += "<tr><th>Seller Name</th>" :
        htmlStr += "<tr><th>Buyer Name</th>"

        htmlStr += "<th>Textbook Name</th>\
        <th>Price (USD)</th>\
        <th>Contact Email</th>\
        <th>Details</th>\
        <th>Delete</th>\
        </tr>";
      }

      htmlStr += "<tr>\
      <td>" + currentEntry["name"] + "</td>\
      <td>" + currentEntry["bookName"] + "</td>\
      <td>" + currentEntry["price"] + "</td>\
      <td>" + currentEntry["email"] + "</td>\
      <td><a href=\"details.html?" + currentEntry["uuid"] + "\">Details</a></td>\
      <td><button id='del' onclick=\"deleteData('";

      (tableID == "sellTable") ?
      htmlStr += "deleteSellData" :
      htmlStr += "deleteBuyData"

      htmlStr += "' , '" + tableID + "', '" +
      currentEntry["uuid"] + "')\">X</button</td>\
      </tr>";
    }

    htmlStr += "</div></table>";
  }
  else {
    htmlStr += "<table class=\"table table-striped table-bordered\">\
    <tr><td>No offers so far!</td></tr></table>";
  }

  table.innerHTML = htmlStr;
}

function loadSelectData(selectID) {
  var data, htmlStr, inner, select;

  switch(selectID) {
    case "subjectDown":
      data = subjectData;
      htmlStr = "";
      inner = "subjectName";
      select = subjectDown;
      break;
  }

  for(var i = 0; i < data.length; i++) {
    var currentEntry = data[i];
    htmlStr += "<option value=\"" + currentEntry["uuid"] + "\" >"
    + currentEntry[inner] + "</option>";
  }

  select.innerHTML = htmlStr;
}

// Populates a single table with textbook search results
function loadSearchedTextbooks(tableID) {
  var table = document.getElementById(tableID);
  var htmlStr = "";

  if(queriedBookData.length > 0) {
    htmlStr += "<tr><th>Textbook Name</th>\
    <th>Author</th>\
    <th>ISBN</th>\
    <th>Select</th>\
    </tr>";

    for(var i = 0; i < queriedBookData.length; i++) {
      var currentEntry = queriedBookData[i];

      htmlStr += "<tr>\
      <td>" + currentEntry["bookName"] + "</td>\
      <td>" + currentEntry["author"] + "</td>\
      <td>" + currentEntry["isbn"] + "</td>\
      <td><button onclick=\"set_book_info(" + i.toString() + ")\"]>Select</button></td>\
      </tr>";
    }
  }
  else {
    htmlStr += "<tr><td>No textbooks found</td></tr>";
  }

  table.innerHTML = htmlStr;
}

function get_subject_name(subjectID) {
  for(var i = 0; i < subjectData.length; i++) {
    var currentEntry = subjectData[i];

    if(currentEntry["uuid"] === subjectID) {
      return currentEntry["subjectName"];
    }
  }
}
