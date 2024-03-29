const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  guildID: { type: String, required: true },
  messages: { type: Number, default: 0 },
  level_up_messages: { type: Boolean, default: false },
  level_up_messagesid: { type: String, default: null },
  rolejoin: { type: Boolean, default: false },
  rolejoinid: { type: String, default: null },
  swearWords: { type: Array, default: [] },
  toggle: { type: Boolean, default: false }, //For Swear Words Toggle
  welchid: { type: String, default: null },
  welcome: { type: Boolean, default: false },
  leavechannelid: { type: String, default: null },
  leave: { type: Boolean, default: false },
  ignored_channels: { type: Array, default: [] },
  Command: { type: Array, default: [] },
  Content: { type: Array, default: [] },
  muterole: { type: String, default: null },
  warnings: {
    all: { type: Map, of: Object, default: new Map() },
    c: { type: Number, default: 0 }
  }
});

let compiledModel = mongoose.model("Guild", guildSchema);
module.exports = compiledModel;
