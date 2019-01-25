var express = require('express');
var router = express.Router();
var axios = require('axios');
var User = require("../controllers/api/user")
var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
    res.render("homeOff",{loggefIn:false})
});

/*GET página de registo. */
router.get('/paginaRegisto',(req,res)=>{
  res.render('paginaRegisto')
})

router.get("/homeOff", (req,res)=>{
  res.render('homeOff')
})

router.get("/login", (req,res)=>{
  res.render('login')
})

router.get("/homeOn/:id", (req,res)=>{
  axios.get('http://localhost:6400/api/posts/')
    .then(dados => {
      axios.get("http://localhost:6400/api/users/"+req.params.id)
        .then(dados2=>res.render('homeOn',{posts:dados.data,user:dados2.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Ocorreu um erro a carregar os posts"})
    })
})

/*Perfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.get("/profile/:id", (req,res)=>{
  axios.get('http://localhost:6400/api/users/'+req.params.id)
    .then(dados1 => {
      axios.get('http://localhost:6400/api/posts/'+req.params.id)
        .then(dados2=> {
          console.log(dados2.data)
          res.render("profile",{user:dados1.data, posts:dados2.data})
        })
        .catch(erro => {res.render('error',{error:erro,message:"Erro ao encontrar os posts do utilizador."})})
      })
    .catch(erro => {res.render('error',{error:erro,message:"Erro na procura do utilizador"})})
})


/*EditPerfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.post("/editPhoto/:id", (req,res)=>{

  var form = new formidable.IncomingForm()
  form.parse(req,(erro,fields,files)=>{
      var fenviado= files.picture.path
      var fnovo = './public/uploaded/users/' + files.picture.name

      fs.rename(fenviado,fnovo,erro=>{
          if(!erro){
              var id_picture = {}
              id_picture.id = req.params.id
              id_picture.picture='./uploaded/users/' + files.picture.name
              axios.post('http://localhost:6400/api/users/editPicture',id_picture)
                .then(dados1 => { 
                    axios.get('http://localhost:6400/api/posts/'+req.params.id)
                        .then(dados2=> {
                          console.log(dados2.data)
                          res.render("profile",{user:dados1.data, posts:dados2.data})
                        })
                        .catch(erro => {res.render('error',{error:erro,message:"Erro ao encontrar os posts do utilizador."})})
                })
                .catch(erro => {res.render('error',{error:erro,message:"Erro na modificação dos dados do utilizador."})})
          }
          else{
            res.render('error',{error:erro, message:"Ocorreu um erro a guardar a imagem"})
          }
      })
  })
})

module.exports = router;
