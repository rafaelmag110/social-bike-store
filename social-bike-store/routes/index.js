var express = require('express');
var router = express.Router();
var axios = require('axios');
var User = require("../controllers/api/user")

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {loggedIn:false});
});

/*GET página de registo. */
router.get('/paginaRegisto',(req,res)=>{
  res.render('paginaRegisto')
})

/*Efetuar registo, Falta verificar se já está registado!*/
router.post('/registo',(req,res)=>{
  req.body.picture="./images/default.png"
  req.body.rating="0"
  axios.post("http://localhost:6400/api/users/",req.body)
    .then(dados => {
      console.log(dados);
      res.render('index', {loggedIn:false})
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
      res.render('index',{loggedIn:true, user:dados.data})
    })
    .catch(erro => {
      console.log("Ocorreu um erro a iniciar sessão")
      res.render('error',{error:erro, message:"Email ou password errada"})
    })
})


/*Método do logout*/
router.get('/logout',(req,res)=>{
  res.render('index',{loggedIn:false})
})

/*Perfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.post("/profile", (req,res)=>{
  User.consultByEmail(req.body.email)
    .then(dados => {
        res.render('profile',{user:dados})
    })
    .catch(erro => res.status(500).send('Erro na listagem de Users.'))
})

module.exports = router;
