const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('dbtest.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run("CREATE TABLE sellers(name TEXT, book TEXT, isbn TEXT, price DOUBLE, email TEXT, password TEXT)", (err) =>{
    if (err){}
  });
  var name = 'kdai';
  var bookName = "as you like it";
  var isbn = "xxxxxx";
  var money = 10000;
  var email = "example@email.com"
  var password = "123456"
  db.run("INSERT INTO sellers(name, book, isbn, price, email, password) VALUES(?, ?, ?, ?, ?, ?)", [name, bookName, isbn, money, email, passwords])
    .each("SELECT name FROM sellers", (err, row) => {
      if (err){
        throw err;
      }
      console.log(row.name);
    });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
