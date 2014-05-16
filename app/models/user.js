var mongoose = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  date: { type: Date, default: Date.now },
});

usersSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    }.bind(this));
});

usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

//add  schema, add methods
module.exports = mongoose.model('Users', usersSchema);


// module.exports = User;
