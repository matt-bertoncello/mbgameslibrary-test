var express = require('express');
var router = express.Router();
var authController = require("../controllers/AuthController.js");
var userController = require("../controllers/UserController.js");
var hermesController = require("../controllers/hermes/HermesController.js");

/* Retrieve all chat rooms for this user. */
router.get('/', authController.checkAuthentication, function(req,res) {
  hermesController.getChatRoomsForUser(req.user._id, function(err, chatRoomArray) {
    if(err) { // If there is an error, go back to homepage
      console.log(err);
      res.redirect('/');
    } else{
      res.render('hermes/dashboard', {req: req, chatRoomArray: chatRoomArray});
    }
  })
});

/* New ChatRoom */
router.get('/new', authController.checkAuthentication, (req,res) => res.render('hermes/newchat', {req: req}));

/* Go To ChatRoom */
router.get('/:username', authController.checkAuthentication, (req,res) => {
  userController.getUserFromUsername(req.params.username, function(err, friend) {
    if (err) { // if user doesn't exist, redirect to hermes homepage
      console.log(err);
      res.redirect('/hermes');
    } else {  // If user does exist, attempt to get chatroom
      hermesController.getChat(req.user._id, friend._id, function(err, chatRoom) {
        if (err) {  // If there was an error in retrieving the chatroom from the params, redirect to Hermes homepage.
          console.log(err);
          res.redirect('/hermes');
        } else {
          res.render('hermes/chatroom', {req: req, chatRoom: chatRoom});
        }
      });
    }
  });
});


module.exports = router;
