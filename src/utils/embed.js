// utils/embed.js
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, i, title, msg, color, extraFields = []) => {
    const Embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(msg)
        .setThumbnail(i.user.displayAvatarURL())
        .addFields(...extraFields)
        .setTimestamp()
        .setFooter({ text: 'Developed by Orion', iconURL: client.user.displayAvatarURL() });

    await i.editReply({ embeds: [Embed] });
};
