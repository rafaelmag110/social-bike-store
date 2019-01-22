var mongoose = require('mongoose')
var Schema = mongoose.Schema

var OpinionSchema = new Schema({
   user : {type:String, required:true},
   text : {type:String, required:true}
})

module.exports= mongoose.model("Opinion",OpinionSchema,"opinions")