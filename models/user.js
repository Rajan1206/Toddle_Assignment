const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: String,
    userEmail : String,
    userPassword: String,
    surveys: [mongoose.Schema.Types.Mixed] 
});

module.exports = mongoose.model("User", userSchema);