const discord = require("discord.js");
const passport = require("passport");
const client = new discord.Client();
const mongoose = require("mongoose");
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
const leaves = require("./models/leavechannel.js");
const welcomes = require("./models/welcomechannel.js");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.listen(port);
console.log(`Web is listening on port ${port}`);

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

app.use(
  session({
    secret: "gyutfgdtufatufdfauyfdtuafw62f3wtf26qf75t23qtftdfq57dftq7u2fd7q2tfcd7tq2ft7qfd752fq7tdt7qfad7qtfd68q2fdr6q275d75qd75q75q75di75q",
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

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
const server = require("./models/server.js");
const doauth = require("discord-oauth2");
const { access } = require("fs");
const { profile } = require("console");
const oauth = new doauth();
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
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
  const leave = await leaves.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const welcome = await welcomes.findOneAndUpdate(
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
      log: log.logging,
      logch: log.logchid,
      leave: leave.leave,
      leavech: leave.leavechannelid,
      welcome: welcome.welcome,
      welcomech: welcome.welchid,
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
  await leaves.findOneAndUpdate(
    { guildID: req.params.guildID },
    {
      leave: !req.body.leaves ? false : true,
      leavechannel: req.body.leavechannelid,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await welcomes.findOneAndUpdate(
    { guildID: req.params.guildID },
    { welcome: !req.body.welcomes ? false : true, welchid: req.body.welcheid },
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
  const leave = await leaves.findOneAndUpdate(
    { guildID: req.params.guildID },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  const welcome = await welcomes.findOneAndUpdate(
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
      log: log.logging,
      logch: log.logchid,
      leave: leave.leave,
      leavech: leave.leavechannelid,
      welcome: welcome.welcome,
      welcomech: welcome.welchid,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
    },
  });
});

client.on("ready", async () => {
  console.log(
    `${client.user.tag}'s Dashboard is connected to the Discord API.`
  );
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
      if (cmd === "test") {
        message.reply("It Works!");
      }
    }
  );
});

client.login(token);
