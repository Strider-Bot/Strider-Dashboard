const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leavechannel = new Schema({
    guildID: String,
    leave: {
        type: Boolean,
        default: false
    },
    leavechannelid: String
})

module.exports = mongoose.model('leavechannel', leavechannel);
