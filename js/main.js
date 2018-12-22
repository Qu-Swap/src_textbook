const SELLREQUEST = ["/postSellData", "sellTable"];
const BUYREQUEST = ["/postBuyData", "buyTable"];

function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  newBtn = document.getElementById("newBtn");
  newOffer = document.getElementById("newOffer");

  dropDown = document.getElementById("dropDown");
  dropDown.addEventListener("change", drop_change, false);

  update_layout(2);

  getData('/getSellData', 'sellTable');
  getData('/getBuyData', 'buyTable');
}
