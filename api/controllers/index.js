// Objects
const express = require("express");
var router = express();

// Controller Paths
router.use(require("./offers"));
router.use(require("./textbooks"));
router.use(require("./subjects"));

module.exports = router;