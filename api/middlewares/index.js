// Objects
const express = require("express");
var router = express();

router.use(require("./body-parser"));
router.use(require("./strip-chars"));

module.exports = router;