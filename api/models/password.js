var bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  hash_salt: function(password) {
    return new Promise(function(resolve, reject) {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        resolve(hash);
      });
    });
  },
  verify: function(password, hash) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, hash, function(err, res) {
        resolve(res);
      });
    });
  }
}