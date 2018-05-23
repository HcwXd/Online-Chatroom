const Messages = require('../models/Messages');
const moment = require('moment');
const mongoose = require('mongoose');
class SocketHander {

    constructor() {
        this.db;
    }

    connect() {
        this.db = mongoose.connect(`mongodb://Test:Test123@ds231720.mlab.com:31720/chatroom_db`);
        this.db.Promise = global.Promise;
    }

    getMessages() {
        return Messages.find();
    }

    storeMessages(data) {

        console.log(data);
        const newMessages = new Messages({
            fromName: data.fromName,
            toName: data.toName,
            msg: data.msg,
            time: moment().valueOf(),
        });

        const doc = newMessages.save();
    }
}

module.exports = SocketHander;