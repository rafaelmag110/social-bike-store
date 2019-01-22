var express = require('express')
var router = express.Router();
var Bike = require('../../controllers/api/bike')

// Get Bikes list
router.get('/', (req,res)=>{
    Bike.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de Bikes.'))
})


//Get Bikes by id
router.get('/:id',(req,res)=>{
    Bike.consultId(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.id))
})


//Get Bikes by make
router.get('/:make',(req,res)=>{
    Bike.consultMake(req.params.make)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with make'+req.params.make))
})


//Get Bikes by model
router.get('/:model',(req,res)=>{
    Bike.consultModel(req.params.model)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with make'+req.params.model))
})

// Insert bike
router.post('/', (req,res)=>{
    Bike.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send('Erro insert bike')})
})


module.exports = router;