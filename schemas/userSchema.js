const mongoose = require('mongoose');

const schema = mongoose.Schema({
    id: String,
    email: String,
    name: String,
    gender: String,
    picture: String,
})

module.exports = mongoose.model('users', schema);