var express = require('express');
var router = express.Router();
var passport = require('passport');
var axios = require('axios');
var jwt = require('jsonwebtoken')
var formidable = require('formidable');
var fs = require('fs');


/*Efetuar registo, Falta verificar se já está registado!*/
router.post('/registo',(req,res)=>{
  req.body.picture="/images/default.png"
  req.body.rating="0"
  axios.post("http://"+req.hostname+':6400'+"/api/users/", req.body, {headers: {cookie: req.headers.cookie}})
    .then(dados => {
      req.session.passport.user = dados.data._id;
      var myuser = {_id: dados.data._id, email:dados.data.email};
      // Geração do token
      var token = jwt.sign({user: myuser}, 'dweb2018');
      req.session.token = token;
      // console.log('Token stored in ' + req.sessionID)
      res.redirect('/homeOn')
    })
    .catch(erro => {
      // console.log("Ocorreu um erro a registar o utilizador")
      console.log(erro)
      res.render('error',{error:erro,message:"O email inserido já está registado."})
    })
})

/* Método de Login */
router.post('/login', passport.authenticate('login', {failureRedirect:'/login'}) ,(req,res)=>{
  var myuser = {_id: req.user._id, email:req.user.email};
  // Geração do token
  var token = jwt.sign({user: myuser}, 'dweb2018');
  req.session.token = token;
  // console.log('Token stored in ' + req.sessionID)
  res.redirect('/homeOn')
})

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/return',  passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  var myuser = {_id: req.user._id, email:req.user.email};
  // Geração do token
  var token = jwt.sign({user: myuser}, 'dweb2018');
  req.session.token = token;
  // console.log('Token stored in ' + req.sessionID)
  res.redirect('/');
});

/*Perfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.get("/profile/:id", (req,res)=>{
  axios.get('http://'+req.hostname+':6400'+'/api/users/'+req.params.id, {headers: {cookie: req.headers.cookie}})
    .then(dados1 => {
      axios.get('http://'+req.hostname+':6400'+'/api/posts/'+req.params.id)
        .then(dados2=> {
          res.render("profile",{user:dados1.data, posts:dados2.data})
        })
        .catch(erro => {res.render('error',{error:erro,message:"Erro ao encontrar os posts do utilizador."})})
      })
    .catch(erro => {res.render('error',{error:erro,message:"Erro na procura do utilizador"})})
})

/*Perfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.get("/profileVisit/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
  axios.get("http://"+req.hostname+':6400'+"/api/users/" + req.user._id, {headers: {cookie: req.headers.cookie}})
        .then(dados=>{
          axios.get('http://'+req.hostname+':6400'+'/api/users/'+req.params.id, {headers: {cookie: req.headers.cookie}})
          .then(dados1 => {
            axios.get('http://'+req.hostname+':6400'+'/api/posts/'+req.params.id)
              .then(dados2=> {
                res.render("profileVisit",{user:dados.data,user2:dados1.data, posts:dados2.data})
              })
              .catch(erro => {res.render('error',{error:erro,message:"Erro ao encontrar os posts do utilizador."})})
            })
          .catch(erro => {res.render('error',{error:erro,message:"Erro na procura do utilizador"})})
                })
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})

})

/*EditPerfil de um utilizador - Falta modificar o modo como se obtem o utilzador logdado*/
router.post("/editPhoto/", (req,res)=>{

  var form = new formidable.IncomingForm()
  form.parse(req,(erro,fields,files)=>{
      var fenviado= files.picture.path
      var fnovo = './public/uploaded/users/' + files.picture.name
      fs.rename(fenviado,fnovo,erro=>{
          if(!erro){
              var id_picture = {}
              id_picture.picture='/uploaded/users/' + files.picture.name
              axios.post('http://'+req.hostname+':6400'+'/api/users/'+req.user._id+'/editPicture', id_picture, {headers: {cookie: req.headers.cookie}})
                .then(dados1 => { 
                    axios.get('http://'+req.hostname+':6400'+'/api/posts/'+req.user._id)
                        .then(dados2=> {
                          // console.log(dados2.data)
                          res.render("profile",{user:dados1.data, posts:dados2.data})
                        })
                        .catch(erro => {res.render('error',{error:erro,message:"Erro ao encontrar os posts do utilizador."})})
                })
                .catch(erro => {res.render('error',{error:erro,message:"Erro na modificação dos dados do utilizador."})})
          }
          else{
            console.log(erro)
            res.render('error',{error:erro, message:"Ocorreu um erro a guardar a imagem"})
          }
      })
  })
})

router.get('/logout',(req,res)=>{
  delete req.session["token"];
  req.logOut()
  res.redirect('/')
})

module.exports = router;
