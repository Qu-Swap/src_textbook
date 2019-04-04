const TOTALASSETS = 1;
const TOTALSEARCHSTATES = 4;

const SELLREQUEST = ["postSellData", "sellTable"];
const BUYREQUEST = ["postBuyData", "buyTable"];

var state, searchState, prevSearchState;
var msgBox, msgText;
var subjectDown, subjectID;
var selectBookInfo;

main = function() {
  var sellBtn, sellingOffers;
  var buyBtn, buyingOffers;
  var nav;

  var formText, merchantName;

  // Set both buttons at the top to be unselected
  function set_inactive() {
    sellBtn.removeClass("active");
    buyBtn.removeClass("active");
    nav.removeClass("sell");
    nav.removeClass("buy");
  }

  // Update the state depending on whether "Requests" or "Offers" is selected
  function update_state(val) {
    state = val;

    if (!nav.hasClass("sell") && !nav.hasClass("buy")) {
  	  nav.addClass("no-transition");
  	  nav.one("click", function() {nav.removeClass("no-transition"); });
    }

    set_inactive();

    switch(state) {
      case STATES.BUY:
        buyBtn.addClass("active");
  	  nav.addClass("buy");
        formText.html("Submit a <i>request</i>.");
        merchantName.html("Buyer name");
        break;
      case STATES.SELL:
        sellBtn.addClass("active");
  	  nav.addClass("sell");
        formText.html("Submit an <i>offer</i>.");
        merchantName.html("Seller name");
        break;
    }
  }

  // Update the search menu if the user clicks one of the buttons
  function update_search_layout(val) {
    prevSearchState = searchState;
    searchState = val;

    // Iterate over
    for (var i = 1; i <= TOTALSEARCHSTATES; i++) {
      var el = $(`#searchState${i}`);

      if(i === searchState) {
        el.css("display", "block");
      }
      else {
        el.css("display", "none");
      }
    }
  }

  function book_change() {
    var newBook = $("#newBook");

    switch(this.value) {
      case "new":
        newBook.css("display", "block");
        break;
      default:
        newBook.css("display", "none");
        break;
    }

    bookVal = this.value;
  }

  function show_form_info() {
    var bookInfo = $("#bookInfo");
    var form = $("#bookForm");
    var formData = new FormData(form[0]);

    var htmlStr = `<p>Book Name: ${selectBookInfo["bookName"]}</p>
    <p>Author: ${selectBookInfo["author"]}</p>
    <p>ISBN: ${selectBookInfo["isbn"]}</p>
    <p>Edition/Copyright: ${selectBookInfo["edition"]}</p>
    <p>Publisher: ${selectBookInfo["publisher"]}</p>
    <p>Subject: ${selectBookInfo["subjectName"] ? selectBookInfo["subjectName"] : getDataModule.get_subject_name(subjectID)} </p>`;

    bookInfo.html(htmlStr);
    update_search_layout(4);
  }

  function info_from_form() {
    var form = $("#bookForm");
    var formData = new FormData(form[0]);

    // Should be made constant
    var columns = ["bookName", "author", "isbn", "edition", "publisher"];
    selectBookInfo = {};

    for (category of columns) {
      selectBookInfo[category] = formData.get(category);
    }

    show_form_info();
  }

  function set_book_info(index) {
    selectBookInfo = getDataModule.queriedBookData[index];

    show_form_info();
  }

  function back() {
  	window.location.href = `offers.html?state=${state}`;
  }

  function init() {
    sellBtn = $("#sellBtn");
    buyBtn = $("#buyBtn");
    nav = $("#nav");
    msgBox = $("#msgBox");
    msgText = $("#msgText");

    subjectDown = $("#subjectDown");
    subjectDown.on("change", function() {
      subjectID = this.value;
    });

    formText = $("#formText");
    merchantName = $("#merchantName");

    var query = QueryStringToJSON();
    update_state(query.state || STATES.BUY);
    update_search_layout(1);

    loaded = [];
    getDataModule.getData('getSubjects', 'subjectDown');
  }

  return {
    init: init,
    update_state: update_state,
    update_search_layout: update_search_layout,
    set_book_info: set_book_info,
    info_from_form: info_from_form,
    back: back
  }
}();
