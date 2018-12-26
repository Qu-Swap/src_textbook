const SELLREQUEST = ["/postSellData", "sellTable"];
const BUYREQUEST = ["/postBuyData", "buyTable"];

function get_default() {
  if(window.location.search.substr(1) === "y") return 1;
  return 2;
}

function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  newBtn = document.getElementById("newBtn");
  newOffer = document.getElementById("newOffer");

  dropDown = document.getElementById("dropDown");
  dropDown.addEventListener("change", drop_change, false);

  bookDown = document.getElementById("bookDown");
  bookDown.addEventListener("change", book_change, false);

  update_layout(get_default());

  loaded = 0;
  getData('/getSellData', 'sellTable');
  getData('/getBuyData', 'buyTable');
  getData('/getTextbookData', 'bookDown');
}
