var express = require('express');
var router = express.Router();
var updateUser = require("../controllers/AuthController.js").updateUser;
require('dotenv').config();

router.get('/', updateUser, function(req,res) {
  req.session.host = process.env.APPLICATION_NAME;
  res.render('index', {req: req});
});

router.get('/session', (req, res) => res.render('session', {req: req}))
router.get('/register', (req, res) => res.render('register', {req: req}))
router.post('/register', (req, res) => auth_controller.doRegister(req, res))

/* LOGIN capabilities. If user is already logged in, redirect to user page. */
router.post('/login', (req, res) => auth_controller.doLogin(req, res))
router.get('/login', (req, res, next) => {
  if(req.session.passport && req.session.passport.user) {
    console.log('[ERROR] '+req.session.passport.user+" is already logged in");
    res.redirect('/user');
  } else {
    res.render('login', {req: req})
  }
})

function updateSession(req, res, next) {
  next();
}

module.exports = router;
