/*jshint esversion:6*/
var Discord = require("discord.js");
var usage = require('os-usage');
var now = require('performance-now')
const moment = require('moment')
require('moment-duration-format')
const proto = require("helpful-prototypes");
const jsbeautify = require("js-beautify");
const beautify = jsbeautify.js_beautify;
const cheerio = require("cheerio");
proto.load();
const request = require("request");
let c = 0;
let coolarr = [];
let capitalize = function(str) {
  if (typeof str != "string") return str;
  if (str.length < 1) return str;
  if (str.length < 2) return str.toUpperCase();
  return `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
};
let cut = function(text, joinStr = "\n ... \n ... \n ... \n", sliceCount = 500, blankStr = "\u2064") {
  let newtext = "";
  if (/^\s$/.test(blankStr)) {
    blankStr = "\u2064";
  }
  if (text.length === 0) {
    newtext = blankStr;
  } else if (text.length <= 1024) {
    newtext = text;
  } else {
    sliceCount = Math.min(sliceCount, 512);
    newtext = text.split ``.slice(0, sliceCount).join `` + joinStr + text.split ``.slice(-sliceCount).join ``;
    if (newtext.length >= 1024) {
      newtext = text.split ``.slice(0, 500).join `` + "\n ... \n ... \n ... \n" + text.split ``.slice(-500).join ``;
    }
  }
  return newtext;
};
let infarray = function stuff(amount, content, array = [], isoriginal = true) {
  let newarr = array;
  if (isoriginal) --amount;
  if (amount <= 0) {
    newarr[0] = content;
    return newarr;
  } else {
    newarr[0] = [];
    //console.log(util.inspect(newarr, {depth: Infinity}));
    let newam = amount - 1;
    stuff(newam, content, newarr[0], false);
  }
  if (isoriginal) return newarr;
};
let splitstring = function ss(str, splitat) {
  if (typeof str !== "string") return str;
  if (isNaN(splitat)) return str;
  return str.match(new RegExp(`[^]`.repeat(splitat <= 0 ? 1 : splitat), "g")).map(l => l.split ``);
};
let pairarray = (arr, splitat = 2) => {
  if (!(arr instanceof Array)) return arr;
  let newarr = [];
  let newobj = [];
  arr.map(i => {
    newobj.push(i);
    if (newobj.length === splitat) {
      newarr.push(newobj);
      newobj = [];
    }
  });
  return newarr;
};
let desplitstring = function ss(strarr) {
  if (!(strarr instanceof Array)) return strarr;
  return strarr.map(arr => arr.join("")).join("");
};
let swappairs = pairs => pairs instanceof Array ? pairs.map(arr => arr.reverse()) : (new TypeError("Pairs must be an array."));
let swapeach = (str, amount) => {
  return desplitstring(swappairs(splitstring(str, amount)));
};
let lastcharswap = function(str) {
  if (typeof str !== "string") return str;
  let lastchar = str.length <= 0 ? "" : str.match(/([^])$/)[1];
  let newstr = "";
  for (let letter of str) { newstr += letter; }
  if (lastchar) {
    let charregex = new RegExp(`(${lastchar}+)$`, "i");
    let chars = newstr.match(charregex)[1];
    newstr = `${chars}${newstr.replace(charregex, "")}`;
  }
  return newstr;
};

function ntoa(num) {
  let buf = new Buffer(4);
  buf.writeUInt32BE(num, 0);

  let a = [];
  for (let i = 0; i < 4; i++) {
    a[i] = buf.readUInt8(i);
  }

  return a.join('.');
}
let binarything = function(hexthing) {
  let hexs = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111"
  };
  let newstr = "";
  if (typeof hexthing !== "string") return hexthing;
  for (let letter of hexthing) { newstr += letter; }
  newstr = newstr.split("").map(l => hexs[l]).join("");
  return newstr;
};
let converthex = function(hex) {
  return parseInt(hex, 16); };
let infspec = a => require("util").inspect(a, { depth: Infinity });
const cmdss = require("./cmds.js");
let coolstuff = () => {
  Object.defineProperty(Discord.Channel.prototype, "sender", {
    get: function() {
      //console.log(this);
      return new cmdss.Send(this, me);
    }
  });
  Discord.Channel.prototype.sendr = function(content, options = {}) {
    return this.sender.send(content, options);
  };
};
function translateDate(date) {
    const Months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Days = ["Sat", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Days[date.getUTCDay()] + ", " + date.getUTCDate() + " " + Months[date.getUTCMonth()] + " " + date.getUTCFullYear() + " at " + date.getUTCHours() + ":" + zeros(date.getUTCMinutes(), 2) + ":" + zeros(date.getUTCSeconds(), 2) + "." + zeros(date.getUTCMilliseconds(), 3);
}

function zeros(val, num) {
    while (val.toString().length < num) {
        val = "0" + val;
    }
    return val;
}

function checkDays(date) {
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};
//mem usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const fs = require("fs");
if (process.argv.length <= 2) {
    console.log("Stuff: " + "insert dir here")};
var me = new Discord.Client({
  bot: false,
  disabledEvents: ["TYPING_START", "TYPING_STOP"]

});
//console.log(fs.readdirSync("./"));
let tags = require("./tagstags.json");

function writeTags() {
  fs.writeFileSync("./tagstags.json", JSON.stringify(tags));
  tags = require("./tagstags.json");
}

me.on("debug", console.log);
me.on("warn", console.log);
me.on("message", message => {
  let msg = message;
  var input = message.content;
  var chanel = message.channel;
  var themsg = message.content;

  if (message.author.id === "170578701526892544") {
    if (/^\/hidden\s{1,4}/.test(input)) {
      message.delete();
    }
    if (/^\/botoff$/i.test(input)) {
      message.delete().then(process.exit(1));
}

if(msg.author.id !== me.user.id) return;
if(!msg.content.startsWith("/")) return;

    if (/^\/eval\s{1,4}/i.test(input)) {
      var functionToEval = message.content.match(/^\/eval\s{1,4}([^]+)$/i)[1];
      let evald;
      try {
        /*jshint ignore:start*/
        evald = eval(functionToEval);
        /*jshint ignore:end*/
        if (typeof evald != 'string') {
          evald = require('util').inspect(evald, { depth: 0 });
        }
        let replacea = { token: new RegExp(`${me.token}`, "ig"), email: new RegExp(`${me.user.email}`, "ig") };
        evald = evald.replace(replacea.token, '[Censored]').replace(replacea.email, '[Censored]');
        message.edit("", {
          embed: {
            title: "~---==Eval==---~",
            color: 0xe1ee17,
            fields: [{
              name: "Input",
              value: `\`\`\`js\n${functionToEval}\`\`\``
            }, {
              name: "Output",
              value: `\`\`\`js\n${evald}\`\`\``
            }]
          }
        });
      } catch (err) {
        let replacea = { token: new RegExp(`${me.token}`, "ig"), email: new RegExp(`${me.user.email}`, "ig") };
        message.edit("", {
          embed: {
            title: "~---==Eval==---~",
            color: 0xFF0000,
            fields: [{
              name: "Input",
              value: `\`\`\`js\n${functionToEval}\`\`\``
            }, {
              name: "Error!",
              value: `\`\`\`js\n${err.message.replace(replacea.token, "[Censored]").replace(replacea.email, "[Censored]")}\`\`\``
            }]
          }
        });
        console.log(err.message);
      }
    }
    if (/^\/deleval\s{1,4}/i.test(input)) {
      let functionToEval = message.content.match(/^\/deleval\s{1,4}([^]+)$/i)[1];
      let evald;
      try {
        /*jshint ignore:start*/
        evald = eval(functionToEval /*.replace(/\r?\n|\r/g, ' ')*/ );
        /*jshint ignore:end*/
        if (typeof evald != 'string') {
          evald = require('util').inspect(evald, { depth: 0 });
        }
        let replacea = { token: new RegExp(`${me.token}`, "ig"), email: new RegExp(`${me.user.email}`, "ig") };
        evald = evald.replace(replacea.token, '[Censored]').replace(replacea.email, '[Censored]');
        message.edit("", {
          embed: {
            title: "~---==Eval==---~",
            color: 0xe1ee17,
            fields: [{
              name: "Input",
              value: `\`\`\`js\n${functionToEval}\`\`\``
            }, {
              name: "Output",
              value: `\`\`\`js\n${evald}\`\`\``
            }]
          }
        });
      } catch (err) {
        message.delete();
        console.error(`${err instanceof Error?err.name:"Error"} (deleval) -> ${err instanceof Error?err.toString().replace(new RegExp(`^${err.name}:\\s?`), ""):err}`);
      }
    }
    /*if() {
      var justtestingok = message.content.replace(/PR ?/i, "");
      var cmonworkpls = justtestingok.split(" ");
      procedural(cmonworkpls[0],cmonworkpls[1]);
    }*/
    if(/^\/str\s{1,4}/i.test(input)) {
      var stro = input.replace(/^\/str\s{1,4}/i, "");
      var finalstroke = "~~" + stro + "~~";
      message.edit(finalstroke);
    }
    if(/^\/lenny$/i.test(input)) {
      message.edit("( ͡° ͜ʖ ͡°)");
    }
    if(/^\/nothing$/i.test(input)) {
      message.delete();
      chanel.sendMessage("_ _");
    }
    if(/^\/box\s{1,4}/i.test(input)) {
      var bxm = input.replace(/^\/box\s{1,4}/i, "");
      message.edit("```" + bxm + "```");
    }
    if (message.content.startsWith("/say")) {
var w = message.content.split(" ").splice(1).join(" ");
      message.edit({embed: {
  color: 3447003,
  author: {
    name: me.user.username,
    icon_url: me.user.avatarURL
  },
  fields: [
    {
      name: `\u200b`,
      value: message.content.split(" ").splice(1).join(" ")
    },
  ],
  timestamp: new Date(),
  footer: {
    icon_url: me.user.avatarURL,
    text: '© ViiRal'
  }
}});

      }
}
  if (message.content.startsWith("/uinf0")) {
    message.edit(
      {embed: {
  color: 3447003,
  author: {
    name: `Info on ${me.user.username}#${me.user.dscriminator} (ID: ${me.user.id})`
  },
  fields: [
  {
    name: `❯ Member Details`,
    value: `${me.user.nickname !== null ? `• Nickname: ${me.user.nickname}` : `• No nickname`}`,
},
{
    name: `Roles`,
    value: `•  Working On this.`,
  },
  {
    name: `Joined`,
    value: `• ${me.user.joinedAt}`
  },
  {
    title: `❯ User Details`,
    value: `• Created at: ${me.user.createdAt}${me.user.bot ? `\n • Is a bot account` : ''}`,
  },
  {
    name: `Status`,
    value: `• ${me.user.presence.status}`,
  },
  {
    name: `Game`,
    value: `• ${me.user.presence.game ? me.user.presence.game.name : 'None'}`
  },
],
timestamp: new Date(),
footer: {
  icon_url: me.user.avatarURL,
  text: '© ViiRal'
}
    }});
  }
  if (message.content.startsWith("/time")) {
    message.edit({embed: {
  color: 3447003,
  author: {
    name: me.user.username,
    icon_url: me.user.avatarURL
  },
  title: 'You should be able to see what time it is for me.',
  description: 'If not, give it time. (lol)',
  fields: [
    {
      timestamp: new Date(),
    },
  ],
  footer: {
    icon_url: me.user.avatarURL,
    text: '© ViiRal'
  }
}});
// * Sinfo was done with the help of Greg#5821
}
if (message.content.startsWith("/sinfo")){
var SinfoEmbed = new Discord.RichEmbed()
var verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻"];
        var region = {
            "brazil": "Brazil",
            "eu-central": "Central Europe",
            "singapore": "Singapore",
            "us-central": "U.S. Central",
            "sydney": "Sydney",
            "us-east": "U.S. East",
            "us-south": "U.S. South",
            "us-west": "U.S. West",
            "eu-west": "Western Europe",
            "vip-us-east": "VIP U.S. East",
            "london": "London",
            "amsterdam": "Amsterdam",
            "hongkong": "Hong Kong"
        };
  message.edit({embed:
    SinfoEmbed.setAuthor(`${message.guild.name} | ${message.guild.id}`, message.guild.iconURL ? message.guild.iconURL : me.user.displayAvatarURL)
    .setThumbnail(message.guild.iconURL ? message.guild.iconURL : me.user.displayAvatarURL)
    .addField("Created", `${message.guild.createdAt.toString().substr(0, 15)},\n${checkDays(message.guild.createdAt)}`, true)
    .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
    .addField("Region", region[message.guild.region], true)
    .addField("Members", message.guild.memberCount, true)
    .addField("Roles", message.guild.roles.size, true)
    .addField("Channels", message.guild.channels.size, true)
    .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
    .addField("Default Channel", message.guild.defaultChannel, true)
    .setColor(3447003)});
}
if (message.content.startsWith("/uinfo")){
  var UinfoEmbed = new Discord.RichEmbed()
  var user = message.mentions.users.first()
  if (!user) {
  msg += "User wasn't found.\n";
  user = message.author;
  } else if (!user) {
  user = message.author;
  }
  var userGuild = (message.guild.member(user));
            var game = user.presence.game;
            var gameName = game ? game.name : "Nothing";
            var userRoles = (!userGuild ? null : userGuild.roles.array());
            if (userGuild) {
                userRoles.shift(); //takes @evryone
                for (var i = 0; i < userRoles.length; ++i) {
                    userRoles[i] = userRoles[i].name;
                }
                userRoles = userRoles.join(", ");
            }
            var status = {
                dnd: "Do Not Disturb",
                offline: "Offline/Invisible",
                online: "Online",
                idle: "Idle"
            };
message.edit({embed:
  UinfoEmbed.setAuthor(`${user.username}#${user.discriminator} | ${user.id}`, user.displayAvatarURL)
              .setFooter("")
               .setThumbnail(user.displayAvatarURL)
               .setColor(3447003)
               .addField("Created", `${user.createdAt.toString().substr(0, 15)},\n${checkDays(user.createdAt)}`, true)
               .addField("Joined", `${userGuild.joinedAt.toString().substr(0, 15)},\n${checkDays(userGuild.joinedAt)}`, true)
               .addField("Status", status[user.presence.status], true)
               .addField("Playing", gameName, true)
               .addField("Nickname", userGuild.nickname ? userGuild.nickname : "None", true)
               .addField("Avatar URL", `[Click here!](${user.displayAvatarURL})`, true)
               .addField("Roles", userRoles ? userRoles : "None")
})}
  if (message.content.startsWith("/nickloop")){
    message.edit("Starting..."),
    setInterval(function() {
          // Do something every 5 seconds
  message.guild.members.get(me.user.id).setNickname("V"),
  message.guild.members.get(me.user.id).setNickname("Vi"),
  message.guild.members.get(me.user.id).setNickname("Vii"),
  message.guild.members.get(me.user.id).setNickname("ViiR"),
  message.guild.members.get(me.user.id).setNickname("ViiRa"),
  message.guild.members.get(me.user.id).setNickname("ViiRal"),
  message.guild.members.get(me.user.id).setNickname("ViiRal"),
  message.guild.members.get(me.user.id).setNickname("ViiRa"),
  message.guild.members.get(me.user.id).setNickname("ViiR"),
  message.guild.members.get(me.user.id).setNickname("Vii"),
  message.guild.members.get(me.user.id).setNickname("Vi"),
  message.guild.members.get(me.user.id).setNickname("V"),
  message.guild.members.get(me.user.id).setNickname(""),
  message.guild.members.get(me.user.id).setNickname("ViiRal"),
  message.guild.members.get(me.user.id).setNickname("Z"),
  message.guild.members.get(me.user.id).setNickname("Zi"),
  message.guild.members.get(me.user.id).setNickname("Zii"),
  message.guild.members.get(me.user.id).setNickname("Ziio"),
  message.guild.members.get(me.user.id).setNickname("Ziion"),
  message.guild.members.get(me.user.id).setNickname("Ziione"),
  message.guild.members.get(me.user.id).setNickname("Ziionex"),
  message.guild.members.get(me.user.id).setNickname("Ziionex"),
  message.guild.members.get(me.user.id).setNickname("Ziione"),
  message.guild.members.get(me.user.id).setNickname("Ziion"),
  message.guild.members.get(me.user.id).setNickname("Ziio"),
  message.guild.members.get(me.user.id).setNickname("Zii"),
  message.guild.members.get(me.user.id).setNickname("Zi"),
  message.guild.members.get(me.user.id).setNickname("Z"),
  message.guild.members.get(me.user.id).setNickname(""),
  message.guild.members.get(me.user.id).setNickname("Ziionex"),
  message.guild.members.get(me.user.id).setNickname(""),
message.guild.members.get(me.user.id).setNickname("X_NoHeart"),
message.guild.members.get(me.user.id).setNickname("X_RedOpps"),
message.guild.members.get(me.user.id).setNickname("I'"),
message.guild.members.get(me.user.id).setNickname("I'm"),
message.guild.members.get(me.user.id).setNickname("I'm V"),
message.guild.members.get(me.user.id).setNickname("I'm Vi"),
message.guild.members.get(me.user.id).setNickname("I'm Vii"),
message.guild.members.get(me.user.id).setNickname("I'm ViiR"),
message.guild.members.get(me.user.id).setNickname("I'm ViiRa"),
message.guild.members.get(me.user.id).setNickname("I'm ViiRal"),
message.guild.members.get(me.user.id).setNickname("N"),
message.guild.members.get(me.user.id).setNickname("NA"),
message.guild.members.get(me.user.id).setNickname("NAH"),
message.guild.members.get(me.user.id).setNickname("NAH V"),
message.guild.members.get(me.user.id).setNickname("NAH Vi"),
message.guild.members.get(me.user.id).setNickname("NAH Vii"),
message.guild.members.get(me.user.id).setNickname("NAH ViiR"),
message.guild.members.get(me.user.id).setNickname("NAH ViiRa"),
message.guild.members.get(me.user.id).setNickname("NAH ViiRal"),
message.guild.members.get(me.user.id).setNickname("")}, 5000);
    message.edit("Started: Nickname Loop")
}

if (message.content.startsWith("/playingloop")) {
  message.edit("Starting..."),
  setInterval(function() {
    message.client.user.setGame(`Global Stats:`),
    message.client.user.setGame(`${message.client.users.size} Users | ${message.client.guilds.size} Servers`),
    message.client.user.setGame(`WTF Community Owner`),
    message.client.user.setGame(`LlamaBot Dev`),
    message.client.user.setGame(`DM me your questions`),
    message.client.user.setGame(`Join WTF Community`),
    message.client.user.setGame(`LlamaBot needs more devs`)
  }, 5000);
    message.edit("Starting Playing / announcement status loop.")
}


if (message.content.startsWith("/urlify")) {
             var URLtoURLify = "https://www." + message.content.split(" ").splice(1).join("-");
              message.edit(URLtoURLify),
              message.channel.sendMessage("Get urlified :muscle: ")
}


if (message.content.startsWith("/kill me")) {
message.edit(" :joy: :gun: "),
message.edit(" :joy: :gun: **Suicide successful**"),
message.channel.edit(`**RIP** ${me.user.username}`)
}
if (message.content.startsWith("/vac")){
message.channel.sendMessage("**Vac**ation"),
message.edit("===========================  :red_car: "),
message.edit("==========================  :red_car: "),
message.edit("=========================  :red_car: "),
message.edit("========================  :red_car: "),
message.edit("======================  :red_car: "),
message.edit("=====================  :red_car: "),
message.edit(":warning: **Traffic** :warning: "),
message.edit("=======================  :red_car: "),
message.edit("======================  :red_car: "),
message.edit("=====================  :red_car: "),
message.edit("====================  :red_car: "),
message.edit("===================  :red_car: "),
message.edit("==================  :red_car: "),
message.edit("=================  :red_car: "),
message.edit("================  :red_car: "),
message.edit("===============  :red_car: "),
message.edit("==============  :red_car: "),
message.edit("=============  :red_car: "),
message.edit("============  :red_car: "),
message.edit("===========  :red_car: "),
message.edit("==========  :red_car: "),
message.edit("=========  :red_car: "),
message.edit("========  :red_car: "),
message.edit("=======  :red_car: "),
message.edit("======  :red_car: "),
message.edit("=====  :red_car: "),
message.edit("====  :red_car: "),
message.edit("===  :red_car: "),
message.edit("==  :red_car: "),
message.edit("=  :red_car: "),
message.edit(" :red_car: "),
message.edit("**Vac**ation over")
}

if (message.content.startsWith("/bumpwtf")) {
  message.edit("Loading bump...")
  //setInterval(function() {
  me.guilds.find("name", "WTF Community").channels.find("name", "bot-stuff").sendMessage("=bump"),
  me.guilds.find("name", "WTF Community").channels.find("name", "bot-stuff").sendMessage("dlm!bump")//}, 14420000);
  message.edit("Bump Sent")
}

if (message.content.startsWith("/ayylmao")) {
  if (message.author.id === "170578701526892544") {
    message.edit("Ayy Lmao :alien:")
    message.react("👌")
    message.react("👽")
    message.react("😂")
    message.react("✌")
}
else {
  return;
}}

if (message.content.startsWith("/react")) {
if (message.author.id === "170578701526892544") {
 message.edit("xd")
 message.react("😂")
 message.react(":DAB:234006093620183042")
 message.react(":rapist:255749544850096132")
 message.react(":Dab:243162820424761344")
 message.react(":dab2:241517464922357762")
 message.react(":Dank:239808811513282560")
 message.react(":thinkingOfHang:273865744205217792")
 message.react(":lolkms:276901243148959745")
 message.react(":lol:264720924975038464")
 message.react(":thinKappa:275103065235914752")
 message.react(":LUL:272928524648710145")
 message.react(":UltraLUL:236949887286116363")
 message.react(":OMEGALUL:271223501086523392")
 message.react(":thinkNitir:273548673873346561")
 message.react(":kek:264695327653756929")
 message.react(":boi:276907602657673217")
 message.react(":ayy:264694554580484096")
 message.react(":wank:274350735020261387")
}
 else {
   return;
 }}



if (message.content.startsWith("/fite")) {
message.edit(`${message.content.toString().substr(6, 1999)} (ง'̀-'́)ง`);
}
if (message.content.startsWith("/stopedit")) {
  var messageEdit = ["I'll ", "never ", "stop ", "editing ", "my ", "message ", "hahaha"];
               var lastMsg = messageEdit[0];
               message.edit(lastMsg)
                   .then(msg => {
                       for (var i = 1; i < messageEdit; i++) {
                           lastMsg += messageEdit[i];
                           msg.edit(lastMsg);
                       }
                   }).catch(console.error);
           }


if (message.content.startsWith("/stats")) {
 const duration = moment.duration(me.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
   message.edit({embed:{
     color: 3447003,
     author: {
       name: 'Selfbot Stastistics',
       icon_url: me.user.avatarURL
     },
     title: '',
     url: '',
     description: '',
     fields: [
       /*{
         name: 'Mem Usage',
         value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
         inline: true
       },*/
       {
         name: 'Mem Usage',
         value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
         inline: true
       },
       {
         name: 'Uptime',
         value: `${duration}`,
         inline: true
       },
       {
         name: '\u200b',
         value: `\u200b`,
         inline: true
       },
       {
         name: 'Servers',
         value: `${me.guilds.size}`,
         inline: true
       },
       {
         name: 'Channels',
         value: `${me.channels.size}`,
         inline: true
       },
       {
         name: 'Users',
         value: `${me.guilds.map(guild => guild.memberCount).reduce((a, b) => a + b)}`,
         inline: true
       },
       {
         name: 'Announcements',
         value: `ViiRal needs devs to help work on LlamaBot - Beta`,
         inline: true
       },
       {
         name: 'LlamaBot',
         value: `[Invite](https://discordapp.com/oauth2/authorize?client_id=257609946970062859&scope=bot&permissions=2146958463)`,
         inline: false
       },
       {
         name: 'WTF Community',
         value: `[Invite](https://discord.gg/pQwcNPN)`,
         inline: false
       }
     ],
     timestamp: new Date(),
     footer: {
       icon_url: me.user.avatarURL,
       text: '© ViiRal'
     }
   }})};

     if (/^\/reply\s{1,4}(?:\d+|<@!?\d+>)\s{1,4}[^]+/i.test(input)) {
       if (message.author.id === "170578701526892544") {
        let counted = 0;
        let replyTo = input.match(/^\/reply\s{1,4}(\d+)[^]*$/i) ? input.match(/^\/reply\s{1,4}(\d+)[^]*$/i)[1] : input.match(/^\/reply\s{1,4}(?:\d+|<@!?(\d+)>)\s{1,4}[^]+/i)[1];
        let oldreplyto = replyTo + "a";
        if (/^\/reply\s{1,4}<@!?(\d+)>\s{1,4}[^]+/i.test(input)) {
          if (me.users.has(replyTo)) {
            chanel.fetchMessages({limit: 20}).then(msgs=>{for (let msg of Array.from(msgs)) {
              let mmsg = msg[1];
              if (mmsg.author.id == replyTo) {
                replyTo = mmsg.id;
                break;
              }
            }
              if (replyTo == oldreplyto.replace(/a$/, "")) return message.edit("No message found by that user in the last 20 messages!");
              if (replyTo == "ohnoe") return message.edit("User not found.");
              const replyText = input.match(/^\/reply\s{1,4}(?:\d+|<@!?\d+>)\s{1,4}([^]+)/i)[1];
              message.channel.fetchMessages({limit: 1, around: replyTo}).then(messages=> {
                  const replyToMsg = messages.first();
                  message.channel.sendMessage(replyToMsg.author + ", " + replyText, {embed: {
                  color: 3447003,
                    author: {
                      name: `${replyToMsg.author.username}`,
                      icon_url: replyToMsg.author.avatarURL
                    },
                    description: replyToMsg.content,
                    timestamp: new Date(),
                    footer: { text:`ID: ${replyToMsg.author.id}` }
                  }})
                  .then(() => message.delete());
              }).catch(err=>console.log(err.message));
            });
          }
          else {
            replyTo = "ohnoe";
          }
        } else {
          const replyText = input.match(/^\/reply\s{1,4}(?:\d+|<@!?\d+>)\s{1,4}([^]+)/i)[1];
          message.channel.fetchMessages({limit: 1, around: replyTo}).then(messages=> {
            if (messages.size !== 0) {
                const replyToMsg = messages.first();
                message.edit(replyToMsg.author + ", " + replyText, {embed: {
                  color: 3447003,
                  author: {
                    name: `${replyToMsg.author.username}`,
                    icon_url: replyToMsg.author.avatarURL
                  },
                  description: replyToMsg.content,
                  timestamp: new Date(),
                  footer: { text:`ID: ${replyToMsg.author.id}` }
                }})
                .then(() => message.delete());
            } else {
              message.edit("Message not found! [in this channel]");
              message.delete(3001);
            }
          }).catch(err=>console.log(err.message));
        }
      }
        }
 else {
   return;
 }
    if (/^\/anger\s{1,4}\d+$/i.test(input)) {
      let meter = input.match(/^\/anger\s{1,4}(\d)\d*$/i)[1];
      if (meter == 1) {
        message.edit(`/¯¯¯¯¯¯¯¯¯¯\\
  |:neutral_face: :angry: :rage:|
  \\\\\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_/
  :arrow_up:`);
      } else if (meter == 2) {
        message.edit(`/¯¯¯¯¯¯¯¯¯¯\\
  |:neutral_face: :angry: :rage:|
  \\\\\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_/
         :arrow_up:`);
      } else if (meter == 3) {
        message.edit(`/¯¯¯¯¯¯¯¯¯¯\\
  |:neutral_face: :angry: :rage:|
  \\\\\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_/
                 :arrow_up:`);
      } else {
        message.edit(`Max anger number is 3.`).then(msg=>msg.delete(3000));
      }
    }
    if (/^\/reverse\s{1,4}[^]+$/i.test(input)) {
      let text = input.match(/^\/reverse\s{1,4}([^]+)$/i)[1];
      message.edit(text.split("").reverse().join(""));
    }
    if (/^\/revers\s{1,4}[^]+$/i.test(input)) {
      let text = input.match(/^\/revers\s{1,4}([^]+)$/i)[1];
      message.edit("\u202E"+text);
    }
    if (/^\/error\s{1,4}[^]+$/i.test(input)) {
      let text = input.match(/^\/error\s{1,4}([^]+)$/i)[1];
      message.edit(`\`\`\`js\nError:\n${text}\`\`\``);
    }
    if(/^\/cmd\s{1,4}[^]*$/i.test(message.content)) {
        message.delete();
        var query = message.content.match(/^\/cmd\s{1,4}([^]*)$/i)[1];
        var embed = new Discord.RichEmbed();
        var cp = require("child_process");
        embed.setTitle("~---=Command Line=---~");
        embed.addField("Query:", `\`\`\`js\n${query}\n\`\`\``);
        try {
        cp.exec(query, (error, stdout, stderr) => {
          let replacea = new RegExp(`${me.token.replace(/\./g, "\\.")}|${me.user.email.replace(/\./g, "\\.")}`, "ig");
            if (error) {
                embed.setColor(0xff0000);
                embed.addField("Error:", `\`\`\`js\n${error.toString().replace(replacea, "")}\n\`\`\``);
      console.log(`Command ${query} finished with error:\n${error}`);
                message.channel.sendEmbed(embed);
            } else {
              stdout = stdout.replace(replacea, "");
              stderr = stderr.replace(replacea, "");
                embed.setColor(0x00ff00);
                if (stdout || (!stdout && !stderr)) embed.addField("Stdout:", `\`\`\`js\n${stdout}\n\`\`\``);
                if (stderr) embed.addField("Stderr:", `\`\`\`js\n${stderr}\n\`\`\``);
                if (stderr.length !== 0) {
                    embed.setColor(0xffff00);
                }
                message.channel.sendEmbed(embed);
                console.log(`Command ${query} finished with stdout:\n${stdout}\nand with stderr:\n${stderr}`);
            }
        });
        } catch (err) {
            embed.setColor(0xff0000);
            embed.addField("Error:", `\`\`\`js\n${err.toString()}\n\`\`\``);
    console.log(`Command ${query} finished with error in try / catch: ${err.toString().replace(replacea, "")}`);
            message.channel.sendEmbed(embed);
        }
    }
    if (/^\/beautify(?:\s{1,4}[^]+)?$/i.test(input)) {
      let mode;
      if (!(/^\/beautify\s{1,4}[^]+$/i.test(input))) mode = "any";
      else {
        mode = input.match(/^\/beautify\s{1,4}([^]+)$/i)[1];
        if (!(["any", "self", "others"].testprop(mode))) return message.edit("Unknown mode, modes are `any`, `self`, and `others`.").then(m=>m.delete(3000));
      }
      let successful = false;
      chanel.fetchMessages({limit: 25}).then(msgs=>{
        successful = true;
        let checkspassed = false;
        msgs.map(m=>{
          if (/```js\n[^]+```/.test(m.content)) {
            if (!checkspassed) {
              if (mode == "any" || (mode == "others" && m.author.id !== me.user.id) || (mode == "self" && m.author.id == me.user.id)) {
                checkspassed = true;
                let beautified = m.content.match(/^[^]*```js\n([^]+)```[^]*$/)[1];
                beautified = beautify(beautified);
                message.edit("```js\n"+beautified+"```");
              }
            }
          }
        });
        if (!checkspassed) {
          message.edit("No code blocks found at mode `"+mode+"`!").then(mm=>mm.delete(3000));
        }
      });
    }
    if (/^\/t(?:ag)?\s{1,4}[^]+$/i.test(input)) {
      let tag = input.match(/^\/t(?:ag)?\s{1,4}([^]+)$/i)[1];
      if (!(tag.toLowerCase() in tags)) return message.edit(["Tag not found!", message.delete(4000)][0]);
      let taganswer = tags[tag.toLowerCase()];
      message.edit(taganswer);
    }
    if (/^\/mt(?:ag)?\s{1,4}.+\s{1,4}{.+}\s{1,4}[^]+$/i.test(input)) {
      let action = input.match(/^\/mtag\s{1,4}(.+)\s{1,4}{.+}\s{1,4}[^]+$/i)[1];
      if (!(["add", "remove", "a", "r"].testprop(action))) return message.edit(["Valid actions are add and remove!", message.delete(4000)][0]);
      let tag = input.match(/^\/mtag\s{1,4}.+\s{1,4}{(.+)}\s{1,4}[^]+$/i)[1];
      let response = input.match(/^\/mtag\s{1,4}.+\s{1,4}{.+}\s{1,4}([^]+)$/i)[1];
      if (["add", "a"].testprop(action)) tags[tag.toLowerCase()] = response;
      else delete tags[tag.toLowerCase()];
      writeTags();
      message.edit([`Tag ${["add", "a"].testprop(action)?"added":"removed"} successfully!`, message.delete(3500)][0]);
    }
    if (/^\/dark\s{1,4}[^]+$/i.test(input)) {
      let dark = input.match(/^\/dark\s{1,4}([^]+)$/i)[1];
      let darkified = dark.split("").map(g=>{
        if (/[a-z\s]/i.test(g)) {
          return ` ${g}`;
        }
        return g;
      }).join("");
      message.edit(darkified);
    }
    if (/^\/reg\s{1,4}[^]+$/i.test(input)) {
      let content = input.match(/^\/reg\s{1,4}([^]+)$/i)[1];
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l=>l.toLowerCase());
      let regionals = "🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿".split(" ").map(l=>l+" ");
      let numbers = "one two three four five six seven eight nine keycap_ten".split(" ").map(n=>`:${n}:`);
      let characters = {
        "?": "❔",
        "!": "❕",
        "#": "#⃣",
        "*": "*⃣",
        "$": "💲",
        "+": "➕",
        "-": "➖",
        "÷": "➗",
        "×": "✖"
      };
      let charkeys = Object.keys(characters);
      let charregex = new RegExp("["+charkeys+"]", "i");
      let newcontent = content.split("");
      newcontent = newcontent.map((c, ind)=>{
        if (/[a-z]/i.test(c)) {
          let index;
          alphabet.map((l, i)=>{
            if (l == c.toLowerCase())
              index = i;
          });
          return regionals[index];
        } else if (/\d/.test(c)) {
          let index = Number(c);
          if (newcontent[ind+1] === "0" && c == 1) {
            return ":keycap_ten:";
          } else if (newcontent[ind-1] === "1" && c == 0) {
            return "";
          }
          return numbers[index-1];
        } else if (/\s/.test(c)) {
          return c.repeat(3);
        } else if (charregex.test(c)) {
          return characters[c];
        }
        return c;
      }).join("");
      message.edit(newcontent);
    }
    if (/^\/dstatus$/i.test(input)) {
      request("https://status.discordapp.com/", (err, resp, body)=>{
        if (!err && resp.statusCode === 200) {
          let $ = cheerio.load(body);
          let embed = new Discord.RichEmbed();
          embed.setAuthor("Discord Status", "http://is2.mzstatic.com/image/thumb/Purple111/v4/09/9a/70/099a7006-64c4-a170-de06-42d859a2af9d/source/175x175bb.jpg", "https://status.discordapp.com");
          if ($(".page-status.status-none").length > 0) {
              embed.setColor(0x56A270)
              .setTitle("All systems operational")
              .setDescription("👍🏼");
            message.edit("", {embed});
          } else {
            //console.log("1+1");
            let incident = $(".unresolved-incident");
            let classes = incident.attr("class").split(" ");
            let _$ = cheerio.load(incident.html());
            let title = cheerio.load(_$(".incident-title").html());
            title = title(".actual-title");
            let description = cheerio.load(_$(".updates").html());
            description = description(".update").html().replace(/<strong>([^]+)<\/strong>/g, "**$1**").replace(/<small>[^]+<\/small>/g, "").replace(/<br(?:\s?\/)?>/g, "\n").replace(/"/g, "");
            //console.log(String(2+2)+`\n${description}`);
            //console.log(description);
            let decode = require("html-entities").AllHtmlEntities;
            decode = new decode().decode;
            //console.log(classes);
            description = cut(description);
            embed.setTitle(title.text())
            .setDescription(decode(description));
            let color;
            //console.log(classes[1]);
            switch(classes[1]){
              case "impact-none":
                color=0x333333;
                break;
              case "impact-critical":
                color=0xf04747;
                break;
              case "impact-major":
                color=0xf26522;
                break;
              case "impact-minor":
                color=0xfaa61a;
                break;
              case "impact-maintenance":
                color=0x3498DB;
                break;
            }
            //console.log(color);
            if (color) embed.setColor(color);
            message.edit("", {embed});
          }
        } else {
          console.error("Error at requesting discord status: "+err);
          message.edit("An error occured at requesting discord status!").then(()=>message.delete(3000));
        }
      });
    }
    if (/^\/enc\s{1,4}[^]+$/i.test(input)) {
      let content = input.match(/^\/enc\s{1,4}([^]+)$/i)[1];
      message.edit(zws.encode(content));
      console.log("ZWS: "+zws.encode(content));
    }
    if (/^\/dec\s{1,4}[^]+$/i.test(input)) {
      let content = input.match(/^\/dec\s{1,4}([^]+)$/i)[1];
      message.edit(zws.decode(content));
      console.log("ZWS-de: "+zws.decode(content));
    }
    if (/^\/badge\s.+$/i.test(message.content)) {
      let term = message.content.match(/^\/badge\s(.+)$/i)[1];
      message.delete();
      chanel.sendFile(`https://img.shields.io/jira/sprint/https/jira.spring.io/94.svg${encodeURIComponent(term)}.png`);
      let embed = new Discord.RichEmbed();
      embed.setColor(0x00ff00);
      embed.setImage(`https://img.shields.io/jira/sprint/https/jira.spring.io/94.svg${encodeURIComponent(term)}.png`);
      embed.setTitle("Badge");
      message.edit({
          embed
      });
    }
    if (/^\/log\s{1,4}[^]+$/i.test(input)) {
      let logg = input.match(/^\/log\s{1,4}([^]+)$/i)[1];
      message.delete();
      if (/-\w+$/.test(logg)) {
        let arg = logg.match(/^[^]*-(\w+)$/)[1];
        if (colors[arg]) {
          logg = logg.replace(/-\w+$/, "");
          console.log(colors[arg](logg));
        } else {
          console.log(logg);
        }
      } else
        console.log(logg);
    }
    if (/^\/logg\s{1,4}[^]+$/i.test(input)) {
      let logg = input.match(/^\/logg\s{1,4}([^]+)$/i)[1];
      message.delete();
      eval(`console.log(${logg})`);
    }
});
process.on("unhandledRejection", err => {
  console.error(err.stack);
});

me.on("disconnect", ()=>process.exit(1));
me.on("reconnect", ()=>process.exit(1));
me.login("puttokenhere");
