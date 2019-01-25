var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');
var bikeDB = require('../public/bike_data.json')

/* Formulário de novo post */
router.get('/postForm/:id', passport.authenticate('jwt', {session:false, failureRedirect:'/paginaRegisto'}), (req, res)=>{
    res.render('postForm',{bikes:bikeDB, userid:req.params.id})
});

router.get('/getBikes',(req,res)=>{
    res.jsonp(bikeDB);
})

router.post('/novoPost/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{
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
                axios.post("http://localhost:6400/api/bikes/",bike)
                    .then(resposta => {
                        fnovo = '/uploaded/bikes/' + files.picture.name
                        post.opinions = []
                        post.bike = resposta.data._id
                        post.user = req.params.id
                        post.picture = fnovo
                        //post.postDate = today
                        axios.post("http://localhost:6400/api/posts/",post)
                            .then(resposta=>{
                                res.render('index',{loggedIn:false})
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
