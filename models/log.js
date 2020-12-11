const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var log = new Schema({
    guildID: String,
    logging: {
        type: Boolean,
        default: false
    },
    logchid: String,
        serverupdates: {
        type: Boolean,
        default: false
    },
    serverupdatesid: String
})

module.exports = mongoose.model('serverLog', log);
