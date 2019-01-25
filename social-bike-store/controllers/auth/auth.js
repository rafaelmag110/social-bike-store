var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var UserModel = require('../../models/User')

// Registo de um utilizador
passport.use('registo', new localStrategy({
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

// Estrategia de autenticação de um utilizador
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) =>{
    try{
        // Vai buscar o utilizador
        var user = await UserModel.findOne({email})
        if(!user) 
            return done(null, false, {message:'Utilizador não existe.'})
        
        // Valida a password
        var valid = await user.isValidPassword(password);
        if(!valid)
            return done(null, false, {message:'Password invalida.'})

        return done(null, user, {message:'Login feito com sucesso'});
    }
    catch(error){
        return done(error);
    }
}) )

// Autenticacao com JWT
var JWTStrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt

var extractFromSession = function(req){
    var token = null;
    console.log(req.sessionID)
    if(req && req.session) token = req.session.token
    console.log(token)
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