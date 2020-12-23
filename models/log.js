const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var log = new Schema({
    guildID: String,
    serverUpdates: { type: Boolean, default: false }, // Server Updates (Server Name Changes/Background Changes/Photo Changes/Channel Updates/Perms Updates)
    slogchid: String,
    emojiUpdates: { type: Boolean, default: false }, // Emoji Updates (Emoji Created/Emoji Deleted/Emoji Updated)
    elogchid: String,
    roleUpdates: { type: Boolean, default: false }, // Role Updates (Role Updated/Role Created/Role Deleted)
    rlogchid: String,
    memberUpdates: { type: Boolean, default: false }, // Member Updates (Username Changes/Pic Changes/Tag Changes/Member Joins/Members Leaves)
    mlogchid: String,
    modUpdates: { type: Boolean, default: false }, // Mod Updates (Ban/Kick/Mute/Warn)
    modlogchid: String,
})

module.exports = mongoose.model('serverLog', log);
