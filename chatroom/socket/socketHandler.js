const Messages = require('../models/Messages');
const moment = require('moment');
const mongoose = require('mongoose');
class SocketHander {

    constructor() {
        this.db;
    }

    connect() {
        this.db = mongoose.connect(`mongodb://localhost:27017/nchat`);
        this.db.Promise = global.Promise;
    }

    getMessages() {
        return Messages.find();
    }

    storeMessages(data) {

        console.log(data);
        const newMessages = new Messages({
            name: data.name,
            msg: data.msg,
            time: moment().valueOf(),
        });

        const doc = newMessages.save();
    }
}

module.exports = SocketHander;