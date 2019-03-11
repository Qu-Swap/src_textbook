module.exports = {
  insert: function(req, res) {
    var id = global.uuid();
    var comment = req.body.details;

    global.db.run("INSERT INTO comments VALUES(?, ?)", [id, comment]);

    return id;
  }
}