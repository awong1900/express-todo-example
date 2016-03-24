var utils    = require( '../utils' );
var ObjectID = require('mongodb').ObjectID;

exports.index = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  db.collection('todos')
    .find({'user_id': user_id})
    .sort({'updated_at': -1})
    .toArray(function(err, todos) {
      // console.log(todos);
      res.render('index', {
        title: 'Express Todo Example',
        todos: todos
      });
    });
};

exports.create = function ( req, res, next ){
  db.collection('todos')
    .insertOne({
      user_id: req.cookies.user_id,
      content: req.body.content,
      updated_at: Date.now()
    }, function (err, result) {
      if (err) return next(err);
      console.log(result);
      res.redirect('/');
    });
};

exports.destroy = function ( req, res, next ){
  db.collection('todos')
    .findOne({'_id': new ObjectID(req.params.id)}, function (err, todo) {
      if (err) next(err);
      var user_id = req.cookies ? req.cookies.user_id : undefined;
      if (todo.user_id !== user_id){
        return utils.forbidden( res );
      }
      db.collection('todos')
        .deleteOne({'_id': new ObjectID(req.params.id)}, function (err, result) {
          if (err) return next(err);
          // console.log(result);
          res.redirect('/');
        });
    });
};

exports.edit = function( req, res, next ){
  var user_id = req.cookies ? req.cookies.user_id : undefined;
  db.collection('todos')
    .find({'user_id': user_id})
    .sort({'updated_at': -1})
    .toArray(function (err, todos) {
      if (err) return next(err);
      res.render('edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  db.collection('todos')
    .findOne({'_id':new ObjectID(req.params.id)}, function (err, todo) {
      var user_id = req.cookies ?
        req.cookies.user_id : undefined;
      if( todo.user_id !== user_id ){
        return utils.forbidden( res );
      }
      todo.content    = req.body.content;
      todo.updated_at = Date.now();
      db.collection('todos')
        .updateOne({'_id':new ObjectID(req.params.id)}, todo, function (err, result) {
          if( err ) return next( err );
          res.redirect( '/' );
        });
    });
};

// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};
