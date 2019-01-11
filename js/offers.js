// Put these into a single object someday

// BUY = selling offers, SELL = buying offers
const SELLREQUEST = ["postSellData", "sellTable", "postSearchSellingOffers"];
const BUYREQUEST = ["postBuyData", "buyTable", "postSearchBuyingOffers"];

const TOTALASSETS = 2;

var state;

var sellBtn, sellingOffers;
var buyBtn, buyingOffers;
var msgBox, msgText;

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
      buyingOffers.style = show;
      break;
    case STATES.SELL:
      sellBtn.className = "active";
      sellingOffers.style = show;
      break;
  }
}

function display_message(msg) {
	msgBox.style = "";
	
	switch (msg) {
		case MESSAGES.CREATE:
			msgText.innerHTML = "Offer was created successfully!";
			break;
		case MESSAGES.DELETE:
			msgText.innerHTML = "Offer was deleted successfully!";
			break;
		default:
			msgBox.style = "display: none";
	}
}
function hideMessage() {
	// So that on reload the message will still be gone
	window.history.replaceState({}, document.title, "offers.html?state=" + state);
	// Add a class to the messagebox so that it will hide
	msgBox.classList.add("hide");
	msgBox.addEventListener("transitionend", function() {
		msgBox.style = "display: none";
	}, false);
	
	
}

function newOffer() {
	window.location.href = "create.html?state=" + state;
}

function init() {
  
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");
  
  msgBox = document.getElementById("msgBox");
  msgText = document.getElementById("msgText");
  
  var query = QueryStringToJSON();
  update_layout(query.state || STATES.BUY);
  display_message(query.msg || MESSAGES.NONE);

  loaded = [];
  getData('getSellData', 'sellTable');
  getData('getBuyData', 'buyTable');
  
}
