var express = require('express')
var router = express.Router();
var passport = require('passport');
var Post = require('../../controllers/api/post')

// Get Post list
router.get('/', (req,res)=>{
    if(req.query.make && req.query.model){
        // request has query string make and model
        Post.consult(req.query.make, req.query.model)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Posts por marca e modelo'))
    } else if(req.query.make){
        // request has query string make
        Post.consult(req.query.make)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Posts por marca.'))
    } else if(req.query.model){
        // request has query string model
        Post.consult(req.query.model)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Posts por modelo.'))
    } else {
        Post.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Users.'))
    }
})

// Insert Post
router.post('/',(req,res)=>{
    req.body.postDate= new Date();
    Post.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})

router.post('/like/:id', passport.authenticate('local', { session: false }), (req,res)=>{
    Post.like(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro))
})

router.post('/dislike/:id', passport.authenticate('local', { session: false }), (req,res)=>{
    Post.dislike(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro))
})

// Retrieve all posts from user with id userid
router.get('/:userid',(req,res)=>{
    Post.consult(req.params.userid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting posts from user with id'+req.params.id))
})

router.post('/opinions/:id', passport.authenticate('local', { session: false }), (req,res)=>{
    Post.makeOpinion(req.params.id, req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})


module.exports = router;