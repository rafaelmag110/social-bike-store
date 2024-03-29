var Bike = require("../../models/Bike")

//Todas as motas
module.exports.list = () =>{
    return Bike
        .find()
        .exec()
}

//Mota por id
module.exports.consultId = id =>{
    return Bike
        .find({_id:id})
        .exec()
}

//Motas por marca
module.exports.consultMake = make =>{
    return Bike
        .find({make:make})
        .exec()
}

//Motas por modelo
module.exports.consultModel = model=>{
    return Bike
        .find({model:model})
        .exec()
}

//Inserir uma mota
module.exports.insert = bike =>{
    return Bike.create(bike)
}
