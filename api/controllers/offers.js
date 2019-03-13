// Objects
const express = require("express");
var router = express();

// Modules
var Offer = require("../models/offer");
var PasswordModule = require("../models/password");
var Textbook = require("../models/textbook");
var Comment = require("../models/comment");
var History = require("../models/history");

// General function for sending rows of a table
function send_rows(res, table) {
  Offer.get_table(table, function(rows) {
    res.send(rows);
  });
}

// Looks for 269 error, else send rows
function delete_response(res, rows) {
  if(rows === 269) {
    res.sendStatus(269);
  }
  else {
    res.send(rows);
  }
}

// Calls models in appropriate order for offer insertion, then returns table
function insert_offer(req, table, callback) {
  var comment_id;
  var book_id;

  // More convenient to pass in the entire request objects than extracting data beforehand
  Comment.insert(req).then(function(id) {
    // Store comment id after inserting it into db
    comment_id = id;

    return Textbook.insert(req);
  }).then(function(id) {
    // Same for book_id
    book_id = id;

    return PasswordModule.hash_salt(req);
  }).then(function(hash) {
    // Post the entry with comment_id, book_id, and hash
    return Offer.post_entry(req, book_id, comment_id, hash, table);
  }).then(function() {
    // Finally return the updated offers list
    Offer.get_table(table, function(rows) {
      callback(rows);
    });
  });
}

// Calls models in appropriate order for offer deletion, then returns table
function delete_offer(req, table, callback) {
  var id = req.body.id;
  var password = req.body.password;
  var success = req.body.success === '1' ? 1 : 0;

  Offer.get_full_single(id, table, function(rows) {
    // If the offer was deleted already or user manipulated ID
    if(rows.length === 0) {
      callback(269); // Give the user a message that the offer does not exist :^)
    }
    else {
      PasswordModule.verify(password, rows[0].password).then(function(result) {
        if(result) {
          Offer.delete_entry(id, table, function() {
            Offer.get_table(table, callback);
          });

          History.insert_history(rows, success, table);
        }
        else {
          callback();
        }
      });
    }
  });
}

// GET request for getting selling data
router.get("/getSellData", function(req, res) {
  send_rows(res, "sellers");
});

// GET request for getting buying data
router.get("/getBuyData", function(req, res) {
  send_rows(res, "buyers");
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

// POST request for getting details for a selling offer
router.post('/postDetailsSellingOffers', function(req, res) {
  Offer.search_table_details(req.body.query, "sellers", function(rows) {
    res.send(rows);
  });
});

// POST request for getting details for a buying offer
router.post('/postDetailsBuyingOffers', function(req, res) {
  Offer.search_table_details(req.body.query, "buyers", function(rows) {
    res.send(rows);
  });
});

// POST request for searching the sell table
router.post('/postSearchSellingOffers', function(req, res) {
  Offer.search_table(req, "sellers", function(rows) {
    res.send(rows);
  });
});

// POST request for searching the buy table
router.post('/postSearchBuyingOffers', function(req, res) {
  Offer.search_table(req, "buyers", function(rows) {
    res.send(rows);
  });
});

// POST request for deleting sell data
router.post('/deleteSellData', function(req, res) {
  delete_offer(req, "sellers", function(rows) {
    delete_response(res, rows);
  });
});

// POST request for deleting buy data
router.post('/deleteBuyData', function(req, res) {
  delete_offer(req, "buyers", function(rows) {
    delete_response(res, rows);
  });
});

module.exports = router;