var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
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

UserSchema.pre('save', async function(next){
    // O 10 significa que o metodo hash faz uma encriptação em 10 iterações
    var hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

UserSchema.methods.isValidPassword = async function(password){
    var user = this;
    var compare = await bcrypt.compare(password, user.password);
    return compare;
}

module.exports = mongoose.model('User', UserSchema, 'users')