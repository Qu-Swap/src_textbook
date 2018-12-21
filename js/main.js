function init() {
  sellBtn = document.getElementById("sellBtn");
  sellingOffers = document.getElementById("sellingOffers");

  buyBtn = document.getElementById("buyBtn");
  buyingOffers = document.getElementById("buyingOffers");

  newBtn = document.getElementById("newBtn");
  newOffer = document.getElementById("newOffer");

  update_layout(2);
  getData('/getSellData', 'sellTable'); getData('/getBuyData', 'buyTable');
}
