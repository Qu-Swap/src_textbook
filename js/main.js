var STATES = Object.freeze({BUY: 1, SELL: 2});

const SELLREQUEST = ["postSellData", "sellTable"];
const BUYREQUEST = ["postBuyData", "buyTable"];

function get_default() {
  if(window.location.search.substr(1) === "y") return 1;
  return 2;
}

function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  bookDown = document.getElementById("bookDown");
  bookDown.addEventListener("change", book_change, false);

  formText = document.getElementById("formText");
  textbookText = document.getElementById("textbookText");
  merchantName = document.getElementById("merchantName");

  update_layout(get_default());

  loaded = 0;
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');
  getData('getTextbookData', 'bookDown');
}
