// Put these into a single object someday

// BUY = selling offers, SELL = buying offers
var STATES = Object.freeze({BUY: 1, SELL: 2});

const SELLREQUEST = ["postSellData", "sellTable", "postSearchSellingOffers"];
const BUYREQUEST = ["postBuyData", "buyTable", "postSearchBuyingOffers"];

const TOTALASSETS = 2;

var state;

var sellBtn, sellingOffers;
var buyBtn, buyingOffers;

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
      break;
    case STATES.SELL:
      sellBtn.className = "active";
      buyingOffers.style = show;
      break;
  }
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

function get_default() {
  if (window.location.search.substr(1) === "y") return 1;
  return 2;
}

function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  update_layout(get_default());

  loaded = [];
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');
}
