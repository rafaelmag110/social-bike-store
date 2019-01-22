var express = require('express')
var router = express.Router();
var Opinion = require('../../controllers/api/comment')

// Get Comments list
router.get('/', (req,res)=>{
    Opinion.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Comments.'))
})

//Get Comments by userEmail
router.get('/:email',(req,res)=>{
    Opinion.consultUser(req.params.email)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.email))
})


// Insert Comment
router.post('/', (req,res)=>{
    Opinion.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send('Erro insert comment')})
})


module.exports = router;

