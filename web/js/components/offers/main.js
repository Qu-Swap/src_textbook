// BUY = selling offers, SELL = buying offers
const SELLREQUEST = ["postSellData", "sellTable", "postSearchSellingOffers"];
const BUYREQUEST = ["postBuyData", "buyTable", "postSearchBuyingOffers"];
const TOTALASSETS = 2;

var state;
var msgBox, msgText;

main = function() {
  var sellBtn, sellingOffers;
  var buyBtn, buyingOffers;
  var nav;

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
    let url = window.location.href.split(/[?#]/)[0];
    window.history.replaceState({}, document.title, `${url}?state=${state}`);

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
    display_message(msgBox, msgText, query.msg || MESSAGES.NONE);

    data.get('getSellData', 'sellTable');
    data.get('getBuyData', 'buyTable');
  }

  return {
    init: init,
    update_layout: update_layout,
    newOffer: newOffer
  }
}();
