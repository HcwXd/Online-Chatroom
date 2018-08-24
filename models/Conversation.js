const mongoose = require('mongoose');
const { Schema } = mongoose;
const messageSchema = require('./Message');

const conversationSchema = new Schema({
    member: [String],
    messages: [messageSchema],
});

mongoose.model('conversations', conversationSchema);
