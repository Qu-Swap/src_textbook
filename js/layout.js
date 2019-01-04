// Put these into a single object someday
var state, searchState, prevSearchState;

var sellBtn, sellingOffers;
var buyBtn, buyingOffers;

var subjectDown, subjectID;

var formText, textbookText, merchantName;

var selectBookInfo;

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
      textbookText.innerHTML = "Select a book you would like to buy";
      merchantName.innerHTML = "Buyer name";
      break;
    case STATES.SELL:
      sellBtn.className = "active";
      buyingOffers.style = show;
      formText.innerHTML =
      "Can't find a book you want to sell? <br> Submit a <i>selling request</i>.";
      textbookText.innerHTML = "Select a book you would like to sell";
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

function update_search_layout(val) {
  prevSearchState = searchState;
  searchState = val;

  for(var i = 1; i <= TOTALSEARCHSTATES; i++) {
    var el = document.getElementById("searchState" + (i).toString());

    if(i === searchState) {
      el.style = "display: block";
    }
    else {
      el.style = "display: none";
    }
  }
}

function show_form_info() {
  var bookInfo = document.getElementById("bookInfo");
  var form = document.getElementById("bookForm");
  var formData = new FormData(form);

  var htmlStr = "<p>Book Name: " + selectBookInfo["bookName"] + "</p>\
  <p>Author: " + selectBookInfo["author"] + "</p>\
  <p>ISBN: " + selectBookInfo["isbn"] + "</p>\
  <p>Subject: " + (selectBookInfo["subjectName"] ?
  selectBookInfo["subjectName"] : get_subject_name(subjectID)) + "</p>";

  bookInfo.innerHTML = htmlStr;
  update_search_layout(5);
}

function info_from_form() {
  var form = document.getElementById("bookForm");
  var formData = new FormData(form);

  selectBookInfo =
  {"bookName": formData.get("bookName"),
  "author": formData.get("author"),
  "isbn": formData.get("isbn")};

  show_form_info();
}

function set_book_info(index) {
  selectBookInfo = queriedBookData[index];

  show_form_info();
}

function toggle_element(elementID) {
  var el = document.getElementById(elementID);

  if(el.style.display === "none" ) {
    el.style.display = "block";
  }
  else {
    el.style.display = "none";
  }
}