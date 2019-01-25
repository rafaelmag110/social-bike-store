var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var UserModel = require('../../models/User')

// Registo de um utilizador
passport.use('registo', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) =>{
    try{
        var user = await UserModel.create({email, password})
        return done(null, user);
    }
    catch(error){
        return done(error);
    }
}))

passport.use('login', new LocalStrategy({
    usernameField: 'email'
    },
    function(username, password, done) {
        UserModel.findOne({ email: username }, function (err, user) {
            
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.isValidPassword(password)) { return done(null, false); }
            return done(null, user);
      });
    }
  ));

// Autenticacao com JWT
var JWTStrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt

var extractFromSession = function(req){
    var token = null;
    if(req && req.session) token = req.session.token
    return token;
}

passport.use(new JWTStrategy({
    secretOrKey: 'dweb2018',
    jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession])
}, async (token, done) => {
    try {
        done( null, token.user);
    } catch ( error ){
        done( error );
    }
}))