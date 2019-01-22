var Post = require('../../models/Post')

// List all posts in database
module.exports.list = () =>{
    return Post
        .find()
        .sort({postDate:-1})
        .exec()
}

// Insert a post in the database
module.exports.insert = post =>{
    return Post.create(post)
}

// Retrieve all the posts made by user with userid
module.exports.consult = userid =>{
    return Post
        .findOne({user:userid})
        .sort({postDate: -1})
        .exec()
}

module.exports.like = postid => {
    return Post
        .update({_id:postid}, {$inc:{likes:1}})
        .exec()
}

module.exports.dislike = postid => {
    return Post
        .update({_id:postid}, {$inc:{dislikes:1}})
        .exec()
}

// module.exports.consult = marca =>{
//     return Post
//         .findOne({marca:userid})
//         .exec()
// }


// module.exports.consult = email =>{
//     return Post
//         .findOne({email:email})
//         .exec()
// }
