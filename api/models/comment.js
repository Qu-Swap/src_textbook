module.exports = {
  insert: function(req) {
    return new Promise(function(resolve, reject) {
      var id = global.uuid();
      var comment = req.body.details;

      global.db.run("INSERT INTO comments VALUES(?, ?)", [id, comment], () => {
        resolve(id);
      });
    });
  }
}