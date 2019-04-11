const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000
var mongoose = require('mongoose')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var auth = require('./routes/auth');
var user = require('./routes/user');
var auth_controller = require("./controllers/AuthController.js");
mongoose.Promise = global.Promise;
require('dotenv').config();

/* Remove deprecated settings from mongoose */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/* Define mongoDB details*/
const mongoDetails = {
  dbName: process.env.MONGO_DB,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  cluster: process.env.MONGO_CLUSTER
}
const uri = 'mongodb+srv://'+mongoDetails.user+':'+mongoDetails.password+'@'+mongoDetails.cluster+'-clgtv.gcp.mongodb.net/'+mongoDetails.dbName+'?authSource=admin&retryWrites=true';

/* Connect to mongoDB*/
mongoose.connect(uri)
  .then(() =>  console.log('[INFO] MongoDB connected successfully'))
  .catch((err) => console.error(err));

/* define which template to view at each address*/
express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    secret: 'kjlhsdklh28o8712hkq3798w31jbk',
    resave: false,
    saveUninitialized: false
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser.json())
  .use('/auth', auth)
  .use('/user', user)
  .set('views', path.join(__dirname, 'views/pages'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .get('/login', (req, res, next) => res.render('login'))
  .get('/register', (req, res) => res.render('register'))
  .post('/register', (req, res) => auth_controller.doRegister(req, res))
  .post('/login', (req, res) => auth_controller.doLogin(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
