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

router.get("/homeOn", passport.authenticate('jwt', {session:false}), (req,res)=>{
  axios.get('http://localhost:6400/api/posts/')
    .then(dados => {
      axios.get("http://localhost:6400/api/users/" + req.user._id)
        .then(dados2=>res.render('homeOn',{posts:dados.data,user:dados2.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Ocorreu um erro a carregar os posts"})
    })
})

module.exports = router;
