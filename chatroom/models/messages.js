const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    fromName: String,
    toName: String,
    msg: String,
    time: Number,
});

module.exports = mongoose.model('Messages', messagesSchema);