var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var formidable = require('formidable')
var mongoose = require('mongoose')
ObjectId = require('mongodb').ObjectID;
var fs = require('fs')
var jsonfile = require('jsonfile')
var jszip = require('jszip')
var User = require("../controllers/api/user")
var base64ToImage= require('base64-to-image')

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
  axios.get('http://'+req.hostname+'/api/posts/')
      .then(dados => {
        res.render("homeOff",{posts:dados.data})})
      .catch(erro =>{console.log(erro);res.render('error',{error:erro,message:"Erro na procura dos posts"})} )
})

router.get("/login", (req,res)=>{
  res.render('login')
})

router.get("/aboutoff", (req,res)=>{
  res.render('aboutOff')
})

router.get('/getExportData',(req,res)=>{
  axios.get('http://'+req.hostname+'/api/posts/export')
    .then(dados => {
      res.redirect('/homeOn')
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Something went wrong exporting the data."})
    })
})

router.get('/importPage/',(req,res)=>{
  res.render('importPage')
})


router.post('/import/',(req,res)=>{
  var form = new formidable.IncomingForm()
  form.parse(req,(erros,fields,files)=>{
    var json = jsonfile.readFileSync(files.json.path);
    var usersPics = fs.readFileSync(files.users.path);
    var postsPics = fs.readFileSync(files.posts.path);
    jszip.loadAsync(usersPics)
      .then(zip => {
        Object.keys(zip.files).forEach(filename => {
          zip.file(filename).async('nodebuffer').then(content => {
            var dest = "./public/uploaded/users/" + filename
            fs.writeFileSync(dest,content)
          })
        })
      })
    jszip.loadAsync(postsPics)
      .then(zip => {
        Object.keys(zip.files).forEach(filename => {
          zip.file(filename).async('nodebuffer').then(content => {
            var dest = "./public/uploaded/posts/" + filename
            fs.writeFileSync(dest,content)
          })
        })
      })
    
    var users = [];
    for(i = 0; i < json.users.length; i++){
      var cur = json.users[i]
      var tempPic = cur.picture
      cur.picture= "/uploaded"+tempPic
      users.push(cur);
    }

    var bikes = [];
    for(i=0; i < json.bikes.length; i++){
      var cur = json.bikes[i]
      bikes.push(cur)
    }

    var posts = [];
    for(i=0; i< json.posts.length; i++){
      var cur = json.posts[i]
      var tempPic = cur.picture
      cur.picture = "/uploaded"+tempPic
      posts.push(cur)
    }


    jsonfile.writeFileSync('/tmp/users.json', users)
    let execUser = require('child_process').execSync
    let commandUser = 'mongoimport --db social-bike-store --collection users --jsonArray /tmp/users.json' 
    execUser(commandUser, (err, stdout, stderr) => {
        if(err){
          res.status(500).send(err)
        }
        else{
          console.log("Users imported")
        }
    })


    jsonfile.writeFileSync('/tmp/bikes.json', bikes)
    let execBikes = require('child_process').execSync
    let commandBikes = 'mongoimport --db social-bike-store --collection bikes --jsonArray /tmp/bikes.json' 
    execBikes(commandBikes, (err, stdout, stderr) => {
        if(err){
          res.status(500).send(err)
        }
        else{
          console.log("Bikes imported")
        }
    })

    jsonfile.writeFileSync('/tmp/posts.json', posts)
    let execPosts = require('child_process').execSync
    let commandPosts = 'mongoimport --db social-bike-store --collection posts --jsonArray /tmp/posts.json' 
    execBikes(commandPosts, (err, stdout, stderr) => {
        if(err){
          res.status(500).send(err)
        }
        else{
          console.log("Posts imported")
        }
    })

    res.redirect('/')
  })
})

router.get("/abouton/:id", (req,res)=>{
   axios.get("http://"+req.hostname+"/api/users/" + req.user._id, {headers: {cookie: req.headers.cookie}})
        .then(dados=>  res.render('aboutOn',{user:dados.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
})

router.get('/searchBike/',passport.authenticate('jwt', {session:false}),(req,res)=>{
  axios.get('http://'+req.hostname+'/api/posts/', {headers: {cookie: req.headers.cookie}})
      .then(dados => {
        var filteredPosts = []
        for(i=0; i<dados.data.length;i++){
          if(dados.data[i].bike.make == req.query.make)
            if(dados.data[i].bike.model == req.query.model || req.query.model=="all")
              filteredPosts.push(dados.data[i])
        }
        axios.get("http://"+req.hostname+"/api/users/" + req.user._id, {headers: {cookie: req.headers.cookie}})
        .then(dados2=>res.render('homeOn',{posts:filteredPosts,user:dados2.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um a encontrar o user"})})
      })
      .catch(erro => res.render('error',{error:erro,message:"Erro na procura das bikes"}))
})

router.get("/homeOn", passport.authenticate('jwt', {session:false}), (req,res)=>{
  axios.get('http://'+req.hostname+'/api/posts/', {headers: {cookie: req.headers.cookie}})
    .then(dados => {
      axios.get("http://"+req.hostname+"/api/users/" + req.user._id, {headers: {cookie: req.headers.cookie}})
        .then(dados2=>res.render('homeOn',{posts:dados.data,user:dados2.data}))
        .catch(erro => {res.render('error',{error:erro,message:"Ocorreu um erro a encontrar o user"})})
    })
    .catch(erro => {
      res.render('error',{error:erro,message:"Ocorreu um erro a carregar os posts"})
    })
})

module.exports = router;
