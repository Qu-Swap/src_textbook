function get_data(uuid, postReq, sellBuy) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      if(data.length > 0) {
        populate(data[0], sellBuy);
      }
    }
  }

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send("query=" + uuid);
}

function get_param() {
  return window.location.search.substr(1);
}

function populate(data, sellBuy) {
  document.getElementById("none").style.display = "none";

  var offerDetails = document.getElementById("offerDetails");
  var bookDetails = document.getElementById("bookDetails");
  var extraDetails = document.getElementById("extraDetails");

  offerDetails.innerHTML =
  "<h2>Offer Details</h2>\
  <p>" + sellBuy + " Name: " + data["name"] + "</p>\
  <p>Price: " + data["price"] + "</p>\
  <p>Contact Email: " + data["email"] + "</p>";

  bookDetails.innerHTML =
  "<h2>Book Details</h2>\
  <p>Book Name: " + data["bookName"] + "</p>\
  <p>Author: " + data["author"] + "</p>\
  <p>ISBN: " + data["isbn"] + "</p>\
  <p>Subject: " + data["subjectName"] + "</p>";

  extraDetails.innerHTML =
  "<h2>Additional Details</h2>\
  <i>" + data["comment"] + "</i>";

  offerDetails.style.display = "block";
  bookDetails.style.display = "block";
  extraDetails.style.display = "block";
}

function init() {
  if(get_param()) {
    get_data(get_param(), "postSearchBuyingOffers", "Buyer");
    get_data(get_param(), "postSearchSellingOffers", "Seller");
  }
}