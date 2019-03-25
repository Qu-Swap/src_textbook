// Objects
const express = require("express");
var router = express();

// Modules
var Subject = require("../models/subject");

// GET request for getting a list of subjects
router.get('/getSubjects', function(req, res) {
  Subject.get_subjects(function(rows) {
    res.send(rows);
  });
});

module.exports = router;