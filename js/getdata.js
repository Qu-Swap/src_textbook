var sellData = [];
var buyData = [];
var textbookData = [];
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
      var data = JSON.parse(ajax.responseText);
      switch(elementID) {
        case "sellTable":
          sellData = data;
          break;
        case "buyTable":
          buyData = data;
          break;
        case "bookDown":
          textbookData = data;
          break;
      }

      loaded++;

      // If all data has been loaded (indicating this is the last response)
      if(loaded === 3) {
        loadTableData("sellTable");
        loadTableData("buyTable");
        loadSelectData("bookDown");
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

function loadTableData(tableID) {
  var data;
  (tableID == "sellTable") ?
  data = sellData :
  data = buyData

  var table = document.getElementById(tableID);
  var htmlStr = ""

  if(data.length > 0) {
    (tableID == "sellTable") ?
    htmlStr += "<tr><th>Seller Name</th>" :
    htmlStr += "<tr><th>Buyer Name</th>"

    htmlStr += "<th>Textbook Name</th>\
    <th>Price (USD)</th>\
    <th>Email</th>\
    <th>Delete</th>\
    </tr>";
  }
  else {
    htmlStr += "<tr>\
    <td>No offers so far!</td>\
    </tr>";
  }

  for(var i = 0; i < data.length; i++) {
    var currentEntry = data[i];

    htmlStr += "<tr>\
    <td>" + currentEntry["name"] + "</td>\
    <td>" + currentEntry["bookName"] + "</td>\
    <td>" + currentEntry["price"] + "</td>\
    <td>" + currentEntry["email"] + "</td>\
    <td><button id='del' onclick=\"deleteData('";

    (tableID == "sellTable") ?
    htmlStr += "/deleteSellData" :
    htmlStr += "/deleteBuyData"

    htmlStr += "' , '" + tableID + "', '" +
    currentEntry["uuid"] + "')\">X</button</td>\
    </tr>";
  }

  (tableID == "sellTable") ?
  sellData = data :
  buyData = data

  table.innerHTML = htmlStr;
}

function loadSelectData(selectID) {
  var data;
  if(selectID === "bookDown") {
    data = textbookData;
  }

  var select = document.getElementById(selectID);
  var htmlStr = "<option value =\"na\"></option>";

  for(var i = 0; i < data.length; i++) {
    var currentEntry = data[i];
    htmlStr += "<option value=\"" + currentEntry["uuid"] + "\" >"
    + currentEntry["bookName"] + "</option>";
  }

  htmlStr += "<option value=\"new\">Insert new book</option>";

  select.innerHTML = htmlStr;
}
