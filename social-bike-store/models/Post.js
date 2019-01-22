var mongoose = require('mongoose');
// var UserSchema = require('User');
// var BikeSchema = require('Bike');
var Schema = mongoose.Schema;

var OpinionSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'User' },
    text : {type:String, required:true}
 })

var PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User' },
    bike: {type: Schema.Types.ObjectId, ref: 'Bike' },
    picture: {type: String, required: true},
    postDate: {type: String, required: true},
    likes: {type: Number, required: true, default:0},
    dislikes: {type: Number, required: true, default:0},
    opinions: [OpinionSchema],
    state: {type: String, required: true, default:'Active'}
})

module.exports = mongoose.model('Post', PostSchema, 'posts')