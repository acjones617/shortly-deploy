var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec().then(function(links) {
    console.log(links);
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  // first search for the link in our Links model
  Link.findOne({url: uri}).exec().then(function (link) {
    if (!link) {
      // create new links document with appropriate data
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err) {
          if (err) {
            console.log(err);
          }
          res.send(200, link);
        });

      });
    } else {
      // if found send them directly to that url
      console.log(link);
      res.send(200, link);
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec().then(function(user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec().then(function(user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      console.log(newUser, 'made new user');
      //util.createSession(req, res, newUser);
      newUser.save(function() {
        res.redirect('/');
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({ code: req.params[0] }).exec().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save();
      return res.redirect(link.url);
    }
  });
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};
