const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    isOnline: { type: Boolean, default: false },
});

module.export = mongoose.model('users', userSchema);
