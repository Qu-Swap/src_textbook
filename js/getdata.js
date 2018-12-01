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
  sellData = JSON.parse(ajax.responseText);

  var table = document.getElementById(tableID);
  var htmlStr = ""

  if(sellData.length > 0) {
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

  for(var i = 0; i < sellData.length; i++) {
    var currentEntry = sellData[i];

    htmlStr += "<tr>\
    <td>" + currentEntry["name"] + "</td>\
    <td>" + currentEntry["bookName"] + "</td>\
    <td>" + currentEntry["isbn"] + "</td>\
    <td>" + currentEntry["price"] + "</td>\
    <td>" + currentEntry["email"] + "</td>\
    <td><button id='del' onclick=\"deleteData('/deleteSellData', 'sellTable'," +
    (i + 1).toString() + ")\">X</button</td>\
    </tr>";
  }

  table.innerHTML = htmlStr;
}
