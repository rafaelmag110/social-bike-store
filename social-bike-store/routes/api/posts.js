var express = require('express')
var router = express.Router();
var passport = require('passport');
var Post = require('../../controllers/api/post')
var jsonfile = require('jsonfile')
var fs = require('fs');
var jszip = require('jszip')


// Get Post list
router.get('/', (req,res)=>{
    if(req.query.make && req.query.model){
        // request has query string make and model
        Post.consult(req.query.make, req.query.model)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Posts por marca e modelo'))
    } else if(req.query.make){
        // request has query string make
        Post.consult(req.query.make)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Posts por marca.'))
    } else if(req.query.model){
        // request has query string model
        Post.consult(req.query.model)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de Posts por modelo.'))
    } else {
        Post.list()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de Posts.'))
    }
})

router.get('/export/',(req,res)=>{
    let execUser = require('child_process').execSync
    let commandUser = 'mongoexport --db social-bike-store --collection users --out /tmp/userExport.json' 
    execUser(commandUser, (err, stdout, stderr) => {
        if(err){
          console.log(err)
        }
        else{
          console.log("Users exported")
        }
    })
    var users = []
    var usersFile = fs.readFileSync("/tmp/userExport.json");
    var usersFileAux = usersFile.toString().split("\n");
    for(i=0; i < usersFileAux.length -1 ; i++){
        users.push(JSON.parse(usersFileAux[i]))
    }
    
    let execBike = require('child_process').execSync
    let commandBike = 'mongoexport --db social-bike-store --collection bikes --out /tmp/bikeExport.json' 
    execBike(commandBike, (err, stdout, stderr) => {
        if(err){
          console.log(err)
        }
        else{
          console.log("Bikes exported")
        }
    })
    var bikes = []
    var bikesFile = fs.readFileSync("/tmp/bikeExport.json");
    var bikesFileAux = bikesFile.toString().split("\n");
    for(i=0; i < bikesFileAux.length -1 ; i++){
        bikes.push(JSON.parse(bikesFileAux[i]))
    }

    let execPost = require('child_process').execSync
    let commandPost = 'mongoexport --db social-bike-store --collection posts --out /tmp/postExport.json' 
    execPost(commandPost, (err, stdout, stderr) => {
        if(err){
          console.log(err)
        }
        else{
          console.log("Posts exported")
        }
    })
    var posts = []
    var postsFile = fs.readFileSync("/tmp/postExport.json");
    var postsFileAux = postsFile.toString().split("\n");
    for(i=0; i < postsFileAux.length -1 ; i++){
        posts.push(JSON.parse(postsFileAux[i]))
    }
    var zip = new jszip();
    zip.file('Readme.txt','Thanks for Downloading!\nYour data is in export.json and the images are in the folder!')
    var usersImg = zip.folder("users");   
    var postsImg = zip.folder("posts")

    var userExport = {};

    for(i=0; i < posts.length; i++){
        var imgP = fs.readFileSync("./public"+posts[i].picture)
        postsImg.file("post"+posts[i]._id["$oid"]+".png",imgP.toString('base64'), {base64:true})
        var tmpimg = posts[i].picture
        posts[i].picture = "/posts/post"+posts[i]._id["$oid"]+".png"
    }

    for(i=0; i < users.length; i++){
        var imgU = fs.readFileSync("./public"+users[i].picture)
        usersImg.file("user"+users[i]._id["$oid"]+".png",imgU.toString('base64'), {base64:true})
        users[i].picture = "/users/user"+users[i]._id["$oid"]+".png"
    }

    userExport.users = users;
    userExport.bikes = bikes;
    userExport.posts = posts;
    console.log(userExport)
    zip.file('export.json',JSON.stringify(userExport))
    zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('./public/share/export.zip'))
        .on('finish', function () {
            console.log("export.zip written.");
        });
    res.jsonp(userExport);
})


// Insert Post
router.post('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    req.body.postDate= new Date();
    Post.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})

router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    Post.like(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro))
})

router.post('/dislike/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    Post.dislike(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(erro))
})

// Retrieve all posts from user with id userid
router.get('/:userid', (req,res)=>{
    Post.consult(req.params.userid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting posts from user with id'+req.params.id))
})

router.post('/opinions/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    Post.makeOpinion(req.params.id, req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send(erro)})
})

module.exports = router;