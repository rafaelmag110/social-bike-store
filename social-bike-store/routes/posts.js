var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');
var bikeDB = require('../public/bike_data.json')

/* Formulário de novo post */
router.get('/postForm/:id', (req, res)=>{
    axios.get("http://localhost:6400/api/users/"+req.params.id, {headers: {cookie: req.headers.cookie}})
        .then(dados=> res.render('postForm',{bikes:bikeDB, user:dados.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
})

router.get('/getBikes',(req,res)=>{
    res.jsonp(bikeDB);
})

router.get('/getPosts',(req,res)=>{
    axios.get('http://localhost:6400/api/posts/')
        .then(dados => res.jsonp(dados.data))
        .catch(erro => res.status(500).send("Erro a obter os posts"))
})

router.post('/like/:id',(req,res)=>{
    axios.post('http://localhost:6400/api/posts/like/'+req.params.id, {}, {headers: {cookie: req.headers.cookie}})
        .then(dados => console.log("Like sucess: postid:" + req.params.id))
        .catch(erro => console.log("Like fail: postid:" + req.params.id))
})


router.post('/dislike/:id',(req,res)=>{
    axios.post('http://localhost:6400/api/posts/dislike/'+req.params.id, {}, {headers: {cookie: req.headers.cookie}})
        .then(dados => console.log("Dislike success: postid:" + req.params.id))
        .catch(erro => console.log("Dislike fail: postid:" + req.params.id))
})
/*adicionar user ao reqbody*/ 
router.post('/opinion/:id',(req,res)=>{
    req.body.user = req.user._id;
    axios.post('http://localhost:6400/api/posts/opinions/'+req.params.id, req.body, {headers: {cookie: req.headers.cookie}})
        .then(dados => console.log("Comment success: postid:" +req.params.id))
        .catch(erro => {
            console.log("Comment fail: postid:" +req.params.id)
            res.status(500).send("Comment fail")
        })
})
router.post('/novoPost/:id', (req,res)=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    var form = new formidable.IncomingForm()
    form.parse(req,(erros,fields,files)=>{
        // console.log(req.body)
        var fenviado = files.picture.path
        var fnovo = './public/uploaded/bikes/' + files.picture.name
        var bike = {}
        var post = {}
        bike.make = fields.make
        bike.model = fields.model
        bike.year = fields.year
        bike.month = fields.month
        bike.cylinderCapacity = fields.cylinderCapacity
        bike.power = fields.power
        bike.kilometers = fields.kilometers
        bike.condition = fields.condition
        fs.rename(fenviado,fnovo,err=>{
            if(!err){
                axios.post("http://localhost:6400/api/bikes/", bike, {headers: {cookie: req.headers.cookie}})
                    .then(resposta => {
                        fnovo = '/uploaded/bikes/' + files.picture.name
                        post.opinions = []
                        post.bike = resposta.data._id
                        post.user = req.params.id
                        post.picture = fnovo
                        axios.post("http://localhost:6400/api/posts/", post, {headers: {cookie: req.headers.cookie}})
                            .then(resposta=>{
                                res.redirect('/homeOn')
                            })    
                            .catch(erro => {
                                res.render('error',{error:erro,message:"Ocorreu um erro a guardar o post na BD"})
                            })
                    })
                    .catch(erro => {
                        res.render('error',{error:erro,message:"Ocorreu um erro a guardar a bike na BD"})
                    })
            }
            else{
                res.render('error',{error:err, message:"Ocorreu um erro a guardar a imagem"})
            }
        })
    })
})


module.exports = router;
