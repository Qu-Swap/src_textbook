const express = require("express");
var router = express();

// Remove HTML tags
router.use(function(req, res, next) {
  for(var key in req.body) {
    if(!req.body.hasOwnProperty(key)) continue;

    req.body[key] = req.body[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  next();
});

module.exports = router;