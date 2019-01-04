var STATES = Object.freeze({BUY: 1, SELL: 2});
const TOTALSEARCHSTATES = 5;

const SELLREQUEST = ["postSellData", "sellTable"];
const BUYREQUEST = ["postBuyData", "buyTable"];

const TOTALASSETS = 3;

function get_default() {
  if(window.location.search.substr(1) === "y") return 1;
  return 2;
}

function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  subjectDown = document.getElementById("subjectDown");
  subjectDown.addEventListener("change", function() {
    subjectID = this.value;
  }, false);

  formText = document.getElementById("formText");
  textbookText = document.getElementById("textbookText");
  merchantName = document.getElementById("merchantName");

  update_layout(get_default());
  update_search_layout(1);

  loaded = 0;
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');
  getData('getSubjects', 'subjectDown');
}
