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

router.post('/editPicture',(req,res)=>{
    User.editPicture(req.body.id,req.body.picture)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro =>{ 
            res.status(500).send(erro)})
})
  

module.exports = router;