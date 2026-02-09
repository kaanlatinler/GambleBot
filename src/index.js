require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');


const { REST, Routes } = require("discord.js");
const fs = require("fs");

const express = require('express');
const app = express();

const registerCommand = () => {



const commands = [];
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}


const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log("Komutlar yükleniyor...");
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );
        console.log("Komutlar yüklendi.");
    } catch (error) {
        console.error(error);
    }
})();

}



app.listen(8081, () => {
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.MessageContent,
    ],
  });
  
  eventHandler(client);

//    client.once("ready", async () => {
//     console.log(`🤖 Bot giriş yaptı: ${client.user.tag}`);

//     const cha = client.channels.cache.get("1460705786358665340");

//     if (!cha) return console.log("❌ Emoji kanalı bulunamadı");

//     // 👉 CUSTOM EMOJI
//     await cha.send("<:Pomeriana:1470556638342676521>");

//     // 👉 ANIMATED EMOJI ise
//     // await channel.send("<a:Holstein:1461085271570518236>");

//     // 👉 NORMAL EMOJI
//     // await channel.send("🔥");
//   });

  // registerCommand();



  
  
  client.login(process.env.BOT_TOKEN);
});