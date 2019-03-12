// Objects
const express = require("express");
var router = express();

// Modules
var Offer = require("../models/offer");
var PasswordModule = require("../models/password");
var Textbook = require("../models/textbook");

// Calls models in appropriate order for offer insertion, then returns table
function insert_offer(req, table, callback) {
  var comment_id = comments.insert(req, res);
  var book_id;

  // More convenient to pass in the entire request object than extracting data beforehand
  Textbook.insert(req).then(function(result) {
    book_id = result;

    return PasswordModule.hash_salt(password);
  }).then(function(hash) {
    return Offer.post_entry(req, book_id, comment_id, hash, table);
  }).then(function() {
    Offer.get_table(table, function(rows) {
      callback(rows);
    });
  });
}

// GET request for getting selling data
router.get("/getSellData", function(req, res) {
  Offer.get_table("sellers", function(rows) {
    res.send(rows);
  });
});

// GET request for getting buying data
router.get("/getBuyData", function(req, res) {
  Offer.get_table("buyers", function(rows) {
    res.send(rows);
  });
});

// POST request for inserting sell data
router.post("/postSellData", function(req, res) {
  insert_offer(req, "sellers", function(rows) {
    res.send(rows);
  });
});

// POST request for inserting buy data
router.post("/postBuyData", function(req, res) {
  insert_offer(req, "buyers", function(rows) {
    res.send(rows);
  });
});

module.exports = router;