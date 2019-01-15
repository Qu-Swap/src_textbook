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
  sellBtn.removeClass("active");
  buyBtn.removeClass("active");
  nav.removeClass("sell");
  nav.removeClass("buy");
}

// Update the layout depending on whether "Buy Offers" or "Sell Offers" is selected
function update_layout(val) {
  state = val;
  // If this is the first time we're switching
  
  if (!nav.hasClass("sell") && !nav.hasClass("buy")) {
	  nav.addClass("no-transition");
	  nav.one("click", function() {nav.removeClass("no-transition"); });
  }
  set_inactive();

  switch(state) {
    case STATES.BUY:
      buyBtn.addClass("active");
	  nav.addClass("buy");
      break;
    case STATES.SELL:
      sellBtn.addClass("active");
	  nav.addClass("sell");
      break;
  }
  
}

function newOffer() {
	window.location.href = `create.html?state=${state}`;
}

function init() {

  sellBtn = $("#sellBtn");
  sellingOffers = $("#sellingOffers");

  buyBtn = $("#buyBtn");
  buyingOffers = $("#buyingOffers");

  nav = $("#nav");

  msgBox = $("#msgBox");
  msgText = $("#msgText");

  var query = QueryStringToJSON();
  update_layout(query.state || STATES.BUY);
  display_message(query.msg || MESSAGES.NONE);

  loaded = [];
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');

}
