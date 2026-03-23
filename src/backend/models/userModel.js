const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    userName: {type: String, unique: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: true},
    activationLink: {type: String}
})

module.exports = model('User', UserSchema)
