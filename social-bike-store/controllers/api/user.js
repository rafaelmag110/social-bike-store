var User = require('../../models/User')

// Lista de users
module.exports.list = () =>{
    return User
        .find()
        .exec()
}

module.exports.insert = user =>{
    return User.create(user)
}

module.exports.consultById = id =>{
    return User
        .findOne({_id:id})
        .exec()
}

module.exports.consultByEmail = email =>{
    return User
        .findOne({email:email})
        .exec()
}

module.exports.login = user => {
    return User
        .findOne({email:user.email, password:user.password})
        .exec()
}

// //Devolve a informação de um user
// module.exports.consultar = (eid) =>{
//     return Evento
//     .findOne({_id:eid})
//     .exec()
// }

// // Lista os eventos do tipo T
// module.exports.listarTipo= tipo =>{
//     return Evento
//         .find({tipo:tipo})
//         .sort({data: -1})
//         .exec()
// }
