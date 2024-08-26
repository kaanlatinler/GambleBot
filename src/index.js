require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const hourlyAward = require('./utils/hourlyAward');
const dailyAward = require('./utils/dailyAward');

const express = require('express');
const app = express();

app.listen(5000, () => {
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
  
  setInterval(hourlyAward, 2 * 60 * 60 * 1000);
  setInterval(dailyAward, 24 * 60 * 60 * 1000);
  
  client.login(process.env.BOT_TOKEN);
});