const Discord = require("discord.js");
const bot = new Discord.Client();
let client = bot;
bot.login(process.env.TOKEN);
let prefix = process.env.PREFIX
const fs = require("fs");
const {Canvas} = require("canvas");
const jimp = require("jimp");
const superagent = require("superagent");
const http = require("http");
const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg   = require('fluent-ffmpeg');
const readline = require('readline');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://mystery-tickets.glitch.me/`);
}, 280000);
const moment = require("moment");
/////////////////////////
client.on('error', err => {console.log('[Error]:', err)});
client.on('warn', warn => console.warn(`[WARN] - ${warn}`));
process.on('unhandledRejection', (reason, promise) => {console.log('[Error]:', reason.stack || reason);});
////////////////////////
client.on('message',message =>{
if(message == prefix+"t") {
//message.channel.sendFile('./server.js')

  

}
});

// make a new stream for each time someone starts to talk
function generateOutputFile(channel, member) {
  // use IDs instead of username cause some people have stupid emojis in their name
  const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}

client.on('message', msg => {
  if (msg.content.startsWith(prefix+'join')) {
    let [command, ...channelName] = msg.content.split(" ");
    if (!msg.guild) {
      return msg.reply('no private service is available in your area at the moment. Please contact a service representative for more details.');
    }
    const voiceChannel = msg.guild.channels.find("name", channelName.join(" "));
    //console.log(voiceChannel.id);
    if (!voiceChannel || voiceChannel.type !== 'voice') {
      return msg.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
    }
    voiceChannel.join()
      .then(conn => {
        msg.reply('ready!');
        // create our voice receiver
        const receiver = conn.createReceiver();
        conn.on('speaking', (user, speaking) => {
          if (speaking) {
            msg.channel.sendMessage(`I'm listening to ${user}`);
            // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
            const audioStream = receiver.createPCMStream(user);
            // create an output stream so we can dump our data in a file
            const outputStream = generateOutputFile(voiceChannel, user);
            // pipe our audio data into the file stream
            audioStream.pipe(outputStream);
            outputStream.on("data", console.log);
            // when the stream ends (the user stopped talking) tell the user
            audioStream.on('end', () => {
              msg.channel.sendMessage(`I'm no longer listening to ${user}`);
            });
          }
        }); //*/
      })
      .catch(console.log);
  }
  if(msg.content.startsWith(prefix+'leave')) {
    let [command, ...channelName] = msg.content.split(" ");
    let voiceChannel = msg.guild.channels.find("name", channelName.join(" "));
    voiceChannel.leave();
  }
});
