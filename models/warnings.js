const mongoose = require("mongoose");

const warningssh = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
    GuildID: String,
    GuildName: String,
    TargetID: String,
    TargetTag: String,
    ModeratorID: String,
    ModeratorTag: String,
    InfractionType: String,
    Reason: String,
    Time: String
});

let compiledModel = mongoose.model("warnings", warningssh);
module.exports = compiledModel;

