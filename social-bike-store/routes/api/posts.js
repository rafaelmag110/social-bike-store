var express = require('express')
var router = express.Router();
var passport = require('passport');
var Post = require('../../controllers/api/post')
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
    Post.list()
        .then(dados => {
            var zip = new jszip();
            zip.file('Readme.txt','Thanks for Downloading!\nYour data is in export.json and the images are in the folder!')
            var usersImg = zip.folder("users");   
            var postsImg = zip.folder("posts")
            
            var userExport = {};
            var users = [];
            var posts = [];
            var bikes = [];
            var cur = {};
            for(i=0; i < dados.length; i++){
                cur = dados[i];
                var imgU = fs.readFileSync("./public"+cur.user.picture)
                var imgP = fs.readFileSync("./public"+cur.picture)
                usersImg.file("user"+cur.user._id+".png", imgU.toString('base64'), {base64:true})
                postsImg.file("post"+cur._id+".png",imgP.toString('base64'), {base64:true})
                cur.user.picture = "/users/user"+cur.user._id
                cur.picture = "/posts/post"+cur._id
                bikes.push(cur.bike)
                users.push(cur.user)
                var tempBike = cur.bike._id
                cur.bike = tempBike
                var tempUser = cur.user._id
                cur.user = tempUser;
                // console.log(cur.opinions[0].user._id)
                for(j = 0; j < cur.opinions.length; j++){
                    var tempUserID = cur.opinions[j].user._id
                    cur.opinions[j].user = tempUserID;
                }
                posts.push(cur);
            }
            userExport.users=users;
            userExport.posts=posts;
            userExport.bikes=bikes;

            zip.file('export.json',JSON.stringify(userExport))
            zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
                .pipe(fs.createWriteStream('./public/share/export.zip'))
                .on('finish', function () {
                    console.log("export.zip written.");
                });
            res.jsonp(userExport);
        })
        .catch(erro => {res.status(500).send(erro)})
})



// Insert Post
router.post('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    req.body.postDate= new Date().toLocaleString();
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