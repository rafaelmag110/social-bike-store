var express = require('express');
var router = express.Router();
var axios = require('axios');
var User = require("../controllers/api/user")


/* GET home page. */
router.get('/', function(req, res) {
  axios.get('http://localhost:6400/api/posts/')
    .then(dados => {
      if(req.isAuthenticated())
        res.render('index',{loggedIn:true, user: req.user ,posts:dados.data})
      else
        res.render('index',{loggedIn:false,posts:dados.data})
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Ocorreu um erro a carregar os posts"})
    })
});

/*GET página de registo. */
router.get('/paginaRegisto',(req,res)=>{
  res.render('paginaRegisto')
})


module.exports = router;
