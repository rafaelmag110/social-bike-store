var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var User = require("../controllers/api/user")


/* GET home page. */
router.get('/', function(req, res) {
  if(req.isAuthenticated())
    res.redirect('/homeOn')
  else
    res.redirect('/homeOff')
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

router.get('/searchBike/',(req,res)=>{
  axios.get('http://localhost:6400/api/posts/')
      .then(dados => {
        var filteredPosts = []
        for(i=0; i<dados.data.length;i++){
          if(dados.data[i].bike.make == req.query.make)
            if(dados.data[i].bike.model == req.query.model || req.query.model=="all")
              filteredPosts.push(dados.data[i])
        }

        res.render('index',{loggedIn:false, posts:filteredPosts})
      })
      .catch(erro => res.render('error',{error:erro,message:"Erro na procura das bikes"}))
})

router.get("/homeOn", passport.authenticate('jwt', {session:false}), (req,res)=>{
  axios.get('http://localhost:6400/api/posts/')
    .then(dados => {
      console.log(dados.data)
      axios.get("http://localhost:6400/api/users/" + req.user._id)
        .then(dados2=>res.render('homeOn',{posts:dados.data,user:dados2.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Ocorreu um erro a carregar os posts"})
    })
})

module.exports = router;
