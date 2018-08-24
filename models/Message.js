const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    fromName: String,
    toName: String,
    msg: String,
    time: Number,
});

mongoose.model('messages', messageSchema);
