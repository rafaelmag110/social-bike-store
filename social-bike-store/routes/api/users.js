var express = require('express')
var router = express.Router();
var User = require('../../controllers/api/users')

// Get Users list
router.get('/', (req,res)=>{
    if(req.query.email){
        // request has query string email
        User.consult(req.query.email)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Users.'))
    } else {
        User.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Users.'))
    }
})

// Insert User
router.post('/', (req,res)=>{
    User.inserir(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})

router.get('/:id',(req,res)=>{
    User.consult(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.id))
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