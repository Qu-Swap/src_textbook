// Put these into a single object someday

// BUY = selling offers, SELL = buying offers
const SELLREQUEST = ["postSellData", "sellTable", "postSearchSellingOffers"];
const BUYREQUEST = ["postBuyData", "buyTable", "postSearchBuyingOffers"];

const TOTALASSETS = 2;

var state;

var sellBtn, sellingOffers;
var buyBtn, buyingOffers;
var nav;
var msgBox, msgText;

// Set both buttons at the top to be unselected
function set_inactive() {
  sellBtn.className = "inactive";
  buyBtn.className = "inactive";
  nav.classList.remove("sell");
  nav.classList.remove("buy");
}

// Update the layout depending on whether "Buy Books" or "Sell Books" is selected
function update_layout(val) {
  state = val;

  set_inactive();

  switch(state) {
    case STATES.BUY:
      buyBtn.className = "active";
	  nav.classList.add("buy");
      break;
    case STATES.SELL:
      sellBtn.className = "active";
	  nav.classList.add("sell");
      break;
  }
}

function newOffer() {
	window.location.href = "create.html?state=" + state;
}

function init() {
  
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");
  
  nav = document.getElementById("nav");
  
  msgBox = document.getElementById("msgBox");
  msgText = document.getElementById("msgText");
  
  var query = QueryStringToJSON();
  update_layout(query.state || STATES.BUY);
  display_message(query.msg || MESSAGES.NONE);

  loaded = [];
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');
  
}
