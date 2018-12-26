var sellBtn, sellingOffers;
var buyBtn, buyingOffers;
var newBtn, newOffer;

var dropDown, dropVal = "sell";
var bookDown, bookVal = "na";

function set_inactive() {
  sellBtn.className = "inactive";
  buyBtn.className = "inactive";
  newBtn.className = "inactive";
}

function set_invisible() {
  var invis = "display: none";

  sellingOffers.style = invis;
  buyingOffers.style = invis;
  newOffer.style = invis;
}

function update_layout(state) {
  set_inactive();
  set_invisible();

  var show = "display: block";

  switch(state) {
    case 1:
      buyBtn.className = "active";
      buyingOffers.style = show;
      break;
    case 2:
      sellBtn.className = "active";
      sellingOffers.style = show;
      break;
    case 3:
      newBtn.className = "active";
      newOffer.style = show;
      break;
  }
}

function drop_change() {
  var name = document.getElementById("merchantName");
  var textbook = document.getElementById("textbookText");

  switch(this.value) {
    case "sell":
      name.innerHTML = "Seller name";
      textbook.innerHTML = "I would like to sell the following book:";
      break;
    case "buy":
      name.innerHTML = "Buyer name";
      textbook.innerHTML = "I would like to buy the following book:";
      break;
  }

  dropVal = this.value;
}

function book_change() {
  var newBook = document.getElementById("newBook");

  switch(this.value) {
    case "new":
      newBook.style="display: block";
      break;
    default:
      newBook.style="display: none";
      break;
  }

  bookVal = this.value;
}
