const discord = require("discord.js");
const passport = require("passport");
const client = new discord.Client({ fetchAllMembers: true });
const mongoose = require("mongoose");
const moment = require('moment');
require('moment-duration-format');
const {
  token,
  mongo,
  port,
  clientID,
  clientSecret,
  callbackURL,
  scope,
} = require("./config.json");
const express = require("express");
const app = express();
const logs = require("./models/log.js");
const GuildSettings = require("./models/Guild.js");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: false,
  }));
      client.login(token);
      console.log("[DISCORD API] Connected To Discord API.");
const oneverifyboi = require("passport-discord").Strategy;
const session = require("express-session");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new oneverifyboi(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: scope,
    },
    function (access, refresh, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

app.listen(port);
console.log(`[WEB STARTUP] Web Is Listening On Port ${port}`);
app.use(
  session({
    secret:
      "gyutfgdtufatufdfauyfdtuafw62f3wtf26qf75t23qtftdfq57dftq7u2fd7q2tfcd7tq2ft7qftyye55auheguipafeguifeagufeg9ufea5u80a09hj08ha08yh0aihe5y08ihe508d752fq7tdt7qfad7qtfd68q2fdr6q275d75qd75q75q75di75q",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth",
  passport.authenticate("discord", {
    scope: scope,
  }),
  function (req, res) {}
);

app.get(
  "/auth/callback",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);
app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
console.log("[MONGOOSE] Connected To Database.")
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
const server = require("./models/server.js");
const doauth = require("discord-oauth2");
const { access } = require("fs");
const { profile, timeStamp } = require("console");
const oauth = new doauth();
mongoose.set("returnOriginal", false);
app.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  await res.render("dashboard", {
    data: {
      client: client,
      user: req.user,
      callbackURL: callbackURL,
      clientID: clientID,
      clientSecret: clientSecret,
      user: req.user,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.get("/", async (req, res) => {
  res.render("index", {
    data: {
      client: client,
      user: req.user,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.get("/settings/:guildID", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  if (
    !client.guilds.cache
      .get(req.params.guildID)
      .members.cache.get(req.user.id)
      .hasPermission("ADMINISTRATOR")
  )
    return res.send(
      `You don't have permission to view this server. <a href="/dashboard">Return to Dashboard</a>`
    );
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("settings", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      callbackURL: callbackURL,
      clientID: clientID,
      clientSecret: clientSecret,
      leave: GuildSetting.leave,
      leavech: GuildSetting.leavechannelid,
      welcome: GuildSetting.welcome,
      welcomech: GuildSetting.welchid,
      muterole: GuildSetting.muterole,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.post("/settings/:guildID", async (req, res, next) => {
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    { prefix: req.body.prefix },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    { logging: !req.body.logs ? false : true, logchid: req.body.logch },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {
      welcome: !req.body.welcomes ? false : true,
      welchid: req.body.welcomech,
      leave: !req.body.leaves ? false : true,
      leavechannelid: req.body.leavech,
      muterole: req.body.muterole,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const guild = client.guilds.cache.get(req.params.guildID);
  if (req.body.logs !== null && req.body.logs === "on") console.log("On");
  console.log(req.body.logch);
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("settings", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      alert: "Your Changes Have Been Saved!",
      leave: GuildSetting.leave,
      leavech: GuildSetting.leavechannelid,
      welcome: GuildSetting.welcome,
      welcomech: GuildSetting.welchid,
      muterole: GuildSetting.muterole,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});

const Levels = require("./models/levels");

app.get("/information/:guildID", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  if (
    !client.guilds.cache
      .get(req.params.guildID)
      .members.cache.get(req.user.id)
      .hasPermission("ADMINISTRATOR")
  )
    return res.send(
      `You don't have permission to view this server. <a href="/dashboard">Return to Dashboard</a>`
    );
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const levelData = await Levels.find({ guildID: req.params.guildID });
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("information", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      callbackURL: callbackURL,
      clientID: clientID,
      clientSecret: clientSecret,
      log: log.logging,
      guild: req.params.guildID,
      user: req.user,
      discord_data: req.app.get("client"),
      Levels: levelData,
      logch: log.logchid,
      leave: GuildSetting.leave,
      leavech: GuildSetting.leavechannelid,
      welcome: GuildSetting.welcome,
      welcomech: GuildSetting.welchid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.post("/information/:guildID", async (req, res, next) => {
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    { prefix: req.body.prefix },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    { logging: !req.body.logs ? false : true, logchid: req.body.logch },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    { welcome: !req.body.welcomes ? false : true, welchid: req.body.welcomech },
    { leave: !req.body.leaves ? false : true, leavechannelid: req.body.leavech },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const levelData = await Levels.find({ guildID: req.params.guildID });
  const guild = client.guilds.cache.get(req.params.guildID);
  if (req.body.logs !== null && req.body.logs === "on") console.log("On");
  console.log(req.body.logch);
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("information", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      guild: req.params.guildID,
      user: req.user,
      discord_data: req.app.get("client"),
      Levels: levelData,
      alert: "Your Changes Have Been Saved!",
      log: log.logging,
      logch: log.logchid,
      leave: GuildSetting.leave,
      leavech: GuildSetting.leavechannelid,
      welcome: GuildSetting.welcome,
      welcomech: GuildSetting.welchid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.get("/logs/:guildID", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  if (
    !client.guilds.cache
      .get(req.params.guildID)
      .members.cache.get(req.user.id)
      .hasPermission("ADMINISTRATOR")
  )
    return res.send(
      `You don't have permission to view this server. <a href="/dashboard">Return to Dashboard</a>`
    );
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("logs", {
    data: {
      guildID: req.params.guildID,
      client: client,
      callbackURL: callbackURL,
      clientID: clientID,
      clientSecret: clientSecret,
      serverupdates: log.serverupdates,
      serverupdatesid: log.serverupdatesid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.post("/logs/:guildID", async (req, res, next) => {
  await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {
      serverUpdates: !req.body.serverUpdates ? false : true,
      slogchid: req.body.slogchid,
      emojiUpdates: !req.body.emojiUpdates ? false : true,
      elogchid: req.body.elogchid,
      roleUpdates: !req.body.roleUpdates ? false : true,
      rlogchid: req.body.rlogchid,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const guild = client.guilds.cache.get(req.params.guildID);
  if (req.body.logs !== null && req.body.logs === "on") console.log("On");
  console.log(req.body.logch);
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("logs", {
    data: {
      guildID: req.params.guildID,
      client: client,
      alert: "Your Changes Have Been Saved!",
      serverUpdates: log.serverUpdates,
      slogchid: log.slogchid,
      emojiUpdates: log.emojiUpdates,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.get("/giveaways/:guildID", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  if (
    !client.guilds.cache
      .get(req.params.guildID)
      .members.cache.get(req.user.id)
      .hasPermission("ADMINISTRATOR")
  )
    return res.send(
      `You don't have permission to view this server. <a href="/dashboard">Return to Dashboard</a>`
    );
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("giveaways", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      callbackURL: callbackURL,
      clientID: clientID,
      clientSecret: clientSecret,
      log: log.logging,
      logch: log.logchid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
app.post("/giveaways/:guildID", async (req, res, next) => {
  const s = await server.findOneAndUpdate(
    { guildID: req.params.guildID },
    { prefix: req.body.prefix },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    { logging: !req.body.logs ? false : true, logchid: req.body.logch },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    { welcome: !req.body.welcomes ? false : true, welchid: req.body.welcomech },
    { leave: !req.body.leaves ? false : true, leavechannelid: req.body.leavech },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const guild = client.guilds.cache.get(req.params.guildID);
  if (req.body.logs !== null && req.body.logs === "on") console.log("On");
  console.log(req.body.logch);
  const log = await logs.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const GuildSetting = await GuildSettings.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await res.render("giveaways", {
    data: {
      guildID: req.params.guildID,
      client: client,
      server: s,
      alert: "Your Changes Have Been Saved!",
      log: log.logging,
      logch: log.logchid,
      leave: GuildSetting.leave,
      leavech: GuildSetting.leavechannelid,
      welcome: GuildSetting.welcome,
      welcomech: GuildSetting.welchid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});
client.on("message", async (message) => {
  server.findOneAndUpdate(
    { guildID: message.guild.id },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true },
    async (err, p) => {
      const prefix = p.prefix;
      const args = message.content.trim().split(/ +/g);
      const cmd = args[0].slice(prefix.length).toLowerCase();
      if (!message.content.toLowerCase().startsWith(prefix)) return;
      if (cmd === "dashboardstatus") {
        message.reply("The Dashboard Is Online!\n**Dashboard Node:** Online");
      }
    }
  );
});
