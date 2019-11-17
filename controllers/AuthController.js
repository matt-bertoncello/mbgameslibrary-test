var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userController = require("./UserController");
var User = require("../models/User");

var authController = {};

// Update the local login strategy.
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (!password) {  // If no password is provided,return error.
      err = '[ERROR] No password provided';
      return loginError(err, user, done);
    }
    if (authController.isEmail(username)) {  // If email
      userController.getUserFromEmail(username, function(err, user) {
        if (err) { return loginError(err, user, done); }
        else { authenticate_user(user, password, done); }
      });
    } else {  // If username
      userController.getUserFromUsername(username, function(err, user) {
        if (err) { return loginError(err, user, done); }
        authenticate_user(user, password, done);
      });
    }
  }
));

// Handle password comparison. Assume user is not null.
function authenticate_user(user, password, done) {
  user.comparePassword(password, function(err, match) {
    if (err || !match) { if (err) { return loginError(err, user, done); } }
    else { return done(null, user); }
  });
}

/*
Called when there is an authorization error during login.
Will save the error for the login screen to render.
*/
function loginError(err, user, done) {
  console.log("Login error: "+err);
  authController.login_comment = err;
  return done(null, null, {message: err});  // null, null so passport loads failureRedirect.
}

/*
Redirect to login page if user isn't logged in.
Load User into req.user.
If user does not have a unique username, make user create username.
*/
authController.checkAuthentication = function(req,res,next){
  /* If session has never been initialised on client side, also redirect to login page */
  if (req.session.passport && req.session.passport.user) {
    userController.updateUser(req, res, function() {
      userController.checkUsername(req, res, function() {  // check if username is valid and unique
        next();
      });
    })
  } else {
    authController.postLoginRedirect = req.originalUrl;
    console.log('[ERROR] user is not logged-in. Redirect to login page. Post-authentication redirect: '+authController.postLoginRedirect);
    res.redirect("/login");
  }
}

// Post registration
authController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      console.log('[ERROR] user register unsuccessful')
      res.redirect('/register');
    }

    passport.authenticate('local')(req, res, function () {
      console.log('[INFO] user register successful')
      res.redirect('/user');
    });
  });
}

//Post login
// authController.doLogin = function(req, res) {
//   passport.authenticate('local')(req, res, function(data) {
//     if(data.err) {
//       console.log(data.err);
//       req.session.login_comment = data.err;  // This is deleted by login.js route.
//       res.redirect('/login');
//     } else if (data.user) {
//       console.log('[INFO] user login successful: '+data.user);
//       authController.postAuthentication(req, res);
//     }
//   });
// }

/* Once user has been authenticated, run this function */
authController.postAuthentication = function(req, res) {
  /* If user came from 'checkAuthentication' middleware, return to initial page */
  if (authController.postLoginRedirect) {
    redirect = authController.postLoginRedirect;
    delete authController.postLoginRedirect;
    console.log("[REDIRECT] redirected to: "+redirect)
    res.redirect(redirect);
  } else {
    res.redirect('/user');
  }
}

// logout
authController.logout = function(req, res) {
  console.log('[INFO] user logout')
  req.logout();
  res.redirect('/');
};

// Return true if string is in a valid email format.
authController.isEmail = function(string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(string)) {
    return (true)
  } else {
    return (false)
  }
}

module.exports = authController;
