var Opinion = require("../../models/Comment")

//Todos os comentários
module.exports.list = () =>{
    return Opinion
        .find()
        .exec()
}

//Comentários por utilizador
module.exports.consultUser = userEmail =>{
    return Opinion
        .find({user:userEmail})
        .exec()
}


//Inserir comentário
module.exports.inser = opinion =>{
    return Opinion.create(opinion)
}

