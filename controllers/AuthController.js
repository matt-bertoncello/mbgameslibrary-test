var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

/* next() if user is logged-in. Otherwise redirect to login page */
userController.checkAuthentication = function(req,res,next){
    /* If session has never been initialised on client side, also redirect to login page */
    if(req.session.passport && req.session.passport.user){
        next();
    } else{
      console.log('[ERROR] user is not logged-in. Redirect to login page');
      res.redirect("/login");
    }
}

// Restrict access to root page
userController.home = function(req, res) {
  res.redirect('/');
};

// Go to registration page
userController.register = function(req, res) {
  res.redirect('/register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      console.log('[INFO] user register unsuccessful')
      res.redirect('/register');
    }

    passport.authenticate('local')(req, res, function () {
      console.log('[INFO] user register successful')
      res.redirect('/user');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    console.log('[INFO] user login successful')
    res.redirect('/user');
  });
};

// logout
userController.logout = function(req, res) {
  console.log('[INFO] user logout')
  req.logout();
  res.redirect('/');
};

module.exports = userController;
