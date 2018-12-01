var sellData = [];

function requestData() {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      loadData(this);
    }
  }

  ajax.open("GET", "data/sellOffers.json", true);
  ajax.send();
}

function getData() {
  try {
    requestData();
  }
  catch(e) {
    alert("Error getting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}

function loadData(ajax) {
  sellData = JSON.parse(ajax.responseText);

  var table = document.getElementById("sellTable");
  var htmlStr = ""

  if(sellData.length > 0) {
    htmlStr += "<tr>\
    <th>Seller Name</th>\
    <th>Textbook Name</th>\
    <th>Price (USD)</th>\
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
    <td>" + currentEntry["price"] + "</td>\
    </tr>";
  }

  table.innerHTML = htmlStr;
}
