var express = require('express');
var router = express.Router();
var axios = require('axios');
var formidable = require('formidable');
var fs = require('fs');


/*Efetuar registo, Falta verificar se já está registado!*/
router.post('/registo',(req,res)=>{
  req.body.picture="/images/default.png"
  req.body.rating="0"
  axios.post("http://localhost:6400/api/users/",req.body, {headers: {cookie: req.headers.cookie}})
    .then(dados => {
      res.render('index', {loggedIn:false})
    })
    .catch(erro => {
      console.log("Ocorreu um erro a registar o utilizador")
      res.render('error',{error:erro,message:"O email inserido já está registado."})
    })
})

/* Método de Login */
router.post('/login',(req,res)=>{
  axios.post("http://localhost:6400/api/users/login", req.body, {headers: {cookie: req.headers.cookie}})
    .then(dados => {
      res.redirect('/');
    })
    .catch(erro => {
      console.log("Ocorreu um erro a iniciar sessão")
      res.render('error',{error:erro, message:"Email ou password errada"})
    })
})

/*Perfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.get("/profile/:id", (req,res)=>{
  axios.get('http://localhost:6400/api/users/'+req.params.id)
    .then(dados1 => {
      axios.get('http://localhost:6400/api/posts/'+req.params.id)
        .then(dados2=> {
          // console.log(dados2.data)
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
              id_picture.picture='/uploaded/users/' + files.picture.name
              axios.post('http://localhost:6400/api/users/editPicture',id_picture)
                .then(dados1 => { 
                    axios.get('http://localhost:6400/api/posts/'+req.params.id)
                        .then(dados2=> {
                          // console.log(dados2.data)
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

router.get('/logout',(req,res)=>{
  // req.session.token = {}
  delete req.session["token"];
  req.logOut()
  res.redirect('/')
})



module.exports = router;
