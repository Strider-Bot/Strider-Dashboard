const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var welcomechannel = new Schema({
    guildID: String,
    welcome: {
        type: Boolean,
        default: false
    },
    welchid: String
})

module.exports = mongoose.model('welcomechannel', welcomechannel);
