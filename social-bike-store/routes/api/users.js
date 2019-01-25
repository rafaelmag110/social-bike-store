var express = require('express')
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken')
var User = require('../../controllers/api/user')

// Get Users list
router.get('/', (req,res)=>{
    if(req.query.email){
        // request has query string email
        User.consultByEmail(req.query.email)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Users.'))
    } else {
        User.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Users.'))
    }
})

// Insert User
router.post('/', (req,res)=>{
    User.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})

router.get('/:id', (req,res)=>{
    User.consultById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.id))
})

router.post('/login', async (req,res,next) => {
    passport.authenticate('login', async (err,user,info)=>{
        
        try{
            if(err || !user){
                if(err)
                    return next(err);
                else
                    return next(new Error('The user is not registered!'))
            }
            req.login(user, {session: true}, async(error) =>{
                if(error) return next(error);
                var myuser = {_id: user._id, email:user.email};
                // Geração do token
                var token = jwt.sign({user: myuser}, 'dweb2018');
                console.log(req.session)
                req.session.cookie.token = token;
                console.log(req.session)
                res.jsonp(user);
            })
        } catch(error){
            return next(error);
        }
    })(req,res,next);
})

router.post('/editPicture',(req,res)=>{
    User.editPicture(req.body.id,req.body.picture)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro =>{ 
            res.status(500).send(erro)})
})
  

module.exports = router;