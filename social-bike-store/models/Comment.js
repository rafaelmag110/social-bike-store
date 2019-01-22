var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
   user : {type:String, required:true},
   text : {type:String, required:true}
})

module.exports= mongoose.model("Comment",BikeSchema,"comments")