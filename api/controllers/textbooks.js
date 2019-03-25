// Objects
const express = require("express");
var router = express();

// Modules
var Textbook = require("../models/textbook");

// GET request for getting textbook data
router.get("/getTextbookData", function(req, res) {
  Textbook.get_table(function(rows) {
    res.send(rows);
  });
});

// POST request for searching textbooks
router.post('/postSearchData', function(req, res) {
  Textbook.search(req.body.query, function(rows) {
    res.send(rows);
  });
});

// POST request for getting tags for a certain book
router.post('/postBookTags', function(req, res) {
  Textbook.get_tags(req.body.uuid, function(rows) {
    res.send(rows);
  })
});

module.exports = router;