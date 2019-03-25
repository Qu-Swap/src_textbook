// Objects
const express = require("express");
var router = express();

// body-parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

module.exports = router; 