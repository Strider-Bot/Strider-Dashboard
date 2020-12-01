const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const server = new Schema({
    prefix: {
        type: String,
        default: "$"
    },
    guildID: String
});

module.exports = mongoose.model('prefix', server);
