var Comment = require("../../models/Comment")

//Todos os comentários
module.exports.list = () =>{
    return Comment
        .find()
        .exec()
}

//Comentários por utilizador
module.exports.consultUser = userEmail =>{
    return Comment
        .find({user:userEmail})
        .exec()
}


//Inserir comentário
module.exports.inser = comment =>{
    return Comment.create(comment)
}

