const express = require("express");
var router = express();

// body-parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use(require("./offers"));

module.exports = router;