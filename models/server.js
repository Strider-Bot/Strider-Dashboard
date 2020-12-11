const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var server = new Schema({
    guildID: String,
    prefix: {
        type: String,
        default: "$"
    },
        premium: {
        type: Boolean,
        default: false
    },
            betatesters: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('prefix', server);
