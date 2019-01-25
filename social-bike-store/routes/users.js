var express = require('express');
var router = express.Router();
var axios = require('axios');


/*Efetuar registo, Falta verificar se já está registado!*/
router.post('/registo',(req,res)=>{
  req.body.picture="./images/default.png"
  req.body.rating="0"
  axios.post("http://localhost:6400/api/users/",req.body)
    .then(dados => {
      res.render('homeOn', {user:dados.data})
    })
    .catch(erro => {
      console.log("Ocorreu um erro a registar o utilizador")
      res.render('error',{error:erro,message:"O email inserido já está registado."})
    })
})

/* Método de Login */
router.post('/login',(req,res)=>{
  axios.post("http://localhost:6400/api/users/login",req.body)
    .then(dados => {
      axios.get('http://localhost:6400/api/posts/')
          .then(dados2=> res.render('HomeOn',{user:dados.data,posts:dados2.data}))
          .catch(erro => res.render('error',{error:erro, message:"Erro ao encontrar os posts"}))
    .catch(erro => {
      console.log("Ocorreu um erro a iniciar sessão")
      res.render('error',{error:erro, message:"Email ou password errada"})
    })
  })
})


module.exports = router;
