var express = require('express');
var router = express.Router();
var updateUser = require("../controllers/UserController.js").updateUser;
var authController = require("../controllers/AuthController.js");
var userController = require("../controllers/UserController.js");
require('dotenv').config();

router.get('/', updateUser, function(req,res) {
  req.session.host = process.env.APPLICATION_NAME;
  res.render('index', {req: req});
});

router.get('/session', (req, res) => res.render('session', {req: req}))
router.get('/webgl', (req, res) => res.render('webgl', {req: req}))
router.get('/register', (req, res) => res.render('register', {req: req}))
router.post('/register', (req, res) => authController.doRegister(req, res))

router.get('/user', authController.checkAuthentication, function(req,res) {
  // If the password has been updated, provide it to the ejs file, and change updatePassword to false for next load.
  req.updatedPassword = authController.updatedPassword;
  authController.updatedPassword = false;
  res.render('user', {req: req});
});

/* LOGIN capabilities. If user is already logged in, redirect to user page. */
router.get('/login', (req, res, next) => {
  if(req.session.passport && req.session.passport.user) {
    console.log('[ERROR] '+req.session.passport.user._id+" is already logged in");
    res.redirect('/user');
  } else {
    var comment = authController.loginComment;
    delete authController.loginComment;
    res.render('login', {req: req, loginComment: comment});
  }
});

function updateSession(req, res, next) {
  next();
}

module.exports = router;
