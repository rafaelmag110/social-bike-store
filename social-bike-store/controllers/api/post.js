var Post = require('../../models/Post')

// Lista de users
module.exports.list = () =>{
    return Post
        .find()
        .sort({postDate:-1})
        .exec()
}

module.exports.insert = post =>{
    return Post.create(post)
}

// module.exports.consult = id =>{
//     return Post
//         .findOne({_id:id})
//         .exec()
// }

// module.exports.consult = email =>{
//     return Post
//         .findOne({email:email})
//         .exec()
// }

