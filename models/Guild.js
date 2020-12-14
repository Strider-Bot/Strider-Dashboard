const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  guildID: { type: String, required: true },
  prefix: { type: String, default: "$" },
  level_up_messages: { type: Boolean, default: false },
  swearWords: { type: Array, default: [] },
  toggle: { type: Boolean, default: false }, //For Swear Words
  welchid: { type: String, default: null },
  welcome: { type: Boolean, default: false },
  leavechannelid: { type: String, default: null },
  leave: { type: Boolean, default: false },
  ignored_channels: { type: Array, default: [] },
  warnings: {
    all: { type: Map, of: Object, default: new Map() },
    c: { type: Number, default: 0 }
  }
});

let compiledModel = mongoose.model("Guild", guildSchema);
module.exports = compiledModel;
