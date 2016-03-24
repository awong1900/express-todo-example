var MongoClient = require( 'mongodb' ).MongoClient;

var url = 'mongodb://localhost/express-todo';

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  global.db = db;
  // var collection = db.collection('todos');

})
