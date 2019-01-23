var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    birth: {type: String, required: true},
    cellPhone: {type: String, required: false},
    picture: {type: String, required: true},
    city: {type: String, required: true},
    district: {type: String, required: true},
    nationality: {type: String, required: true},
    rating: {type: String, required: true},
})

module.exports = mongoose.model('User', UserSchema, 'users')