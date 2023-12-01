const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema ({
    email: {
        type: String,
        unique: true
    }, 
    nickname: String, 
    password: String
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;