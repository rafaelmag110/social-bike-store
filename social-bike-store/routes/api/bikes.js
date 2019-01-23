var express = require('express')
var router = express.Router();
var Bike = require('../../controllers/api/bike')

// Get Bikes list
router.get('/', (req,res)=>{
    if(req.query.make){
        Bike.consultMake(req.query.make)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro getting user with make'+req.params.make))
    } else if(req.query.model){
        Bike.consultModel(req.query.model)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro getting user with make'+req.params.model))
    }
    else {
        Bike.list()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de Bikes.'))
    }
    
})


//Get Bikes by id
router.get('/:id',(req,res)=>{
    Bike.consultId(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro getting user with id'+req.params.id))
})

// Insert bike
router.post('/', passport.authenticate('local', { session: false }), (req,res)=>{
    Bike.insert(req.body)
        .then(dados =>{ res.jsonp(dados)})
        .catch(erro =>{ res.status(500).send('Erro insert bike')})
})


module.exports = router;