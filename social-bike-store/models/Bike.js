var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BikeSchema = new Schema({
   mark : {type:String, required:true},
   model : {type:String, required:true},
   year : {type:Number, required:true},
   month : {type:String, required:true},
   cylinderCapacity: {type:Number,required:true},
   power:{type:Number,required:true},
   kilometers:{type:Number,required:true},
   condition:{type:String,required:true}
})

module.exports= mongoose.model("Bike",BikeSchema,"bikes")