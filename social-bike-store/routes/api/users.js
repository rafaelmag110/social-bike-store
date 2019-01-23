var express = require('express')
var router = express.Router();
var passport = require('passport');
var User = require('../../controllers/api/user')

// Get Users list
router.get('/', passport.authenticate('local', { session: false }),(req,res)=>{
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

router.get('/:id', passport.authenticate('local', { session: false }), (req,res)=>{
    User.consultById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.id))
})

router.post('/login',(req,res)=>{
    console.log(req.body)
    User.login(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with email ' + req.params.email))
})

// Autenticar um utilizador
// router.post('/login', (req,res)=>{
//     User.login(req.body)
//         .then(dados => {
//             res.jsonp(dados);
//             console.log(dados);
//         })
//         .catch(erro => res.status(500).send('Erro no login de User.'))
// })

module.exports = router;