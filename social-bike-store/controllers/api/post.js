var Post = require('../../models/Post')

// List all posts in database
module.exports.list = () =>{
    return Post
        .find()
        .populate('user bike')
        .populate('opinions.user')
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
        .find({user:userid})
        .populate('user bike')
        .sort({postDate: -1})
        .exec()
}

module.exports.like = postid => {
    return Post
        .updateOne({_id:postid}, {$inc:{likes:1}})
        .exec()
}

module.exports.dislike = postid => {
    return Post
        .updateOne({_id:postid}, {$inc:{dislikes:1}})
        .exec()
}

module.exports.makeOpinion = (id, opinion) => {
    return Post
        .updateOne({_id:id}, {$push: {opinions: opinion}})
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

