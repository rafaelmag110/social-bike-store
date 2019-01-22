var mongoose = require('mongoose');
// var UserSchema = require('User');
// var BikeSchema = require('Bike');
var CommentSchema = require('Comment')
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    user: {type: String, required: true},
    bike: {type: String, required: true},
    picture: {type: String, required: true},
    postDate: {type: String, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true},
    comments: [CommentSchema],
    state: {type: String, required: true}
})

module.exports = mongoose.model('Post', PostSchema, 'posts')