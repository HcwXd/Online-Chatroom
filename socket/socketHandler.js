const moment = require('moment');
const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);

require('../models/User');
require('../models/Conversation');
require('../models/Message');

const Message = mongoose.model('messages');
const Users = mongoose.model('users');
const Conversations = mongoose.model('conversations');

class SocketHandler {
    constructor() {
        this.db;
    }

    connect() {
        this.db = mongoose.connect(config.mongodb);
        this.db.Promise = global.Promise;
    }

    getMessages(currentUsername, chatUsername) {
        return Message.find({ $or: [{ fromName: currentUsername, toName: chatUsername }, { fromName: chatUsername, toName: currentUsername }] });
    }

    getConversations(currentUsername, chatUsername) {
        return Conversations.find({ member: { $all: [currentUsername, chatUsername] } });
    }

    getUsers() {
        return Users.find();
    }

    storeMessages(fromName, toName, msg) {
        const newMessages = new Message({
            fromName,
            toName,
            msg,
            time: moment().valueOf(),
        });

        const doc = newMessages.save();
        return doc;
    }
}

module.exports = SocketHandler;
