var state;

var sellBtn, sellingOffers;
var buyBtn, buyingOffers;

var bookDown, bookVal = "na";
var formText, textbookText, merchantName;

// Set both buttons at the top to be unselected
function set_inactive() {
  sellBtn.className = "inactive";
  buyBtn.className = "inactive";
}

// Set both tables to be invisible
function set_invisible() {
  var invis = "display: none";

  sellingOffers.style = invis;
  buyingOffers.style = invis;
}

// Update the layout depending on whether "Buy Books" or "Sell Books" is selected
function update_layout(val) {
  state = val;

  set_inactive();
  set_invisible();

  var show = "display: block";

  switch(state) {
    case STATES.BUY:
      buyBtn.className = "active";
      sellingOffers.style = show;
      formText.innerHTML =
      "Don't see a book you want to buy? <br> Submit a <i>buying request</i>.";
      textbookText.innerHTML = "I would like to buy the following book:";
      merchantName.innerHTML = "Buyer name";
      break;
    case STATES.SELL:
      sellBtn.className = "active";
      buyingOffers.style = show;
      formText.innerHTML =
      "Can't find a book you want to sell? <br> Submit a <i>selling request</i>.";
      textbookText.innerHTML = "I would like to sell the following book:";
      merchantName.innerHTML = "Seller name";
      break;
  }
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
