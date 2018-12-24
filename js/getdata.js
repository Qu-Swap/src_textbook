var sellData = [];
var buyData = [];

function requestData(getReq, tableID) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      loadData(this, tableID);
    }
  }

  ajax.open("GET", getReq, true);
  ajax.send();
}

function getData(getReq, tableID) {
  try {
    requestData(getReq, tableID);
  }
  catch(e) {
    alert("Error getting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}

function loadData(ajax, tableID) {
  var data = JSON.parse(ajax.responseText);

  var table = document.getElementById(tableID);
  var htmlStr = ""

  if(data.length > 0) {
    (tableID == "sellTable") ?
    htmlStr += "<tr><th>Seller Name</th>" :
    htmlStr += "<tr><th>Buyer Name</th>"

    htmlStr += "<th>Textbook Name</th>\
    <th>ISBN</th>\
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
    <td>" + currentEntry["isbn"] + "</td>\
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
