const express = require("express");
var router = express();

// body-parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

// Paths
router.use(require("./offers"));
router.use(require("./textbooks"));

module.exports = router;