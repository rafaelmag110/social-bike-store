var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var uuid = require('uuid/v4')
var passport = require('passport');
var session = require('express-session');
var LokiStore = require('connect-loki')(session);


// Route MiddleWare
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var apiUsersRouter = require('./routes/api/users');
var apiPostsRouter = require('./routes/api/posts');
var apiBikesRouter = require('./routes/api/bikes');

// Mongoose Connection
var mongoLOCAL = 'mongodb://127.0.0.1:27017/social-bike-store'
var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-bike-store'
var mongoDB_DEV = 'mongodb://administrador:o42eo58saogays@ds229380.mlab.com:29380/social-bike-store'
mongoose.connect(mongoLOCAL, {useNewUrlParser:true})
  .then(()=> console.log('Mongo ready: ' + mongoose.connection.readyState))
  .catch(()=> console.log('Erro de conexão'))

mongoose.set('useCreateIndex',true);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// Funçaõ inversa
var User = require('./models/User')
passport.deserializeUser((uid, done) => {
  User.findById(uid, function (err, user) {
    done(null, user);
  });
})

var app = express();

function checkSession(req,res,next){
  console.log('User connected with session ' + req.sessionID + ' on ' + req.url);
  next()
}

app.use(express.static(path.join(__dirname, 'public')));

// Sessions

require('./controllers/auth/auth');
app.use(cookieParser());
app.use(session({
  genid: req =>{
    // console.log('Gerada nova sessao ' + req.sessionID + ' '+req.url)
    return uuid();
  },
  store: new LokiStore({}),
  secret: "segredo",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

// app.use(checkSession);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'))
// app.use(express.static('public/uploaded'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/posts', apiPostsRouter);
app.use('/api/bikes', apiBikesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
