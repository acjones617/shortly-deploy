// var Bookshelf = require('bookshelf');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');
// var path = require('path');

console.log('config file running');

var mongodb = process.env.MONGO_URI || 'mongodb://localhost/test';

//exports.db = mongoose.connection;
//exports.db = mongoose;


mongoose.connect(mongodb);

mongoose.connection.on('error', console.error);


// exports.db.once('open', function() {
//   console.log('')
// }); //  db.once not neede

module.exports = mongoose;
