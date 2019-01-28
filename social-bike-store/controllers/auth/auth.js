var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var UserModel = require('../../models/User')

// Registo de um utilizador
// passport.use('registo', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//     }, function(email, password, done){
//         UserModel.create({email, password}, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.isValidPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     })
// );

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
    // console.log(req.session)
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

var FacebookStrategy = require('passport-facebook').Strategy;

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookStrategy({
    clientID: '383669555724709',
    clientSecret: 'f72ccbbfb054cc9f03a8a53da1899e39',
    callbackURL: '/users/return',
    profileFields: ['id', 'displayName', 'email','birthday','address', 'location']
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {};
    if(!profile.email)
        user.email = profile.id+'@mail.com';
    else
        user.email = profile.email;
    user.password = 'facebook';
    user.name = profile.displayName;
    user.birth = '1996/09/01'
    user.picture = '/images/default.png';
    user.city = 'N/A';
    user.district = 'N/A';
    user.nationality = 'N/A';
    user.rating = '0';
    
    //Find the user if it exists
    UserModel.findOne({email:user.email}, (err, user_found)=>{
        if(err) return done(err, null);
        if(!user_found){
            //Create If user doesn't exists
            UserModel.create(user, (err, user_created)=>{
                if(err) return done(err,null);
                if(!user_created) return done(null,false);
                return done(null, user_created);
            })
        };
        return done(null, user_found);
    });
  }));