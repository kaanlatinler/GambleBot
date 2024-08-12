
const { User } = require('../../database/models/index');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "account",
    description: "Displays your account information.",
    callback: async (client, interaction) => {

        await interaction.deferReply();

        const user = await User.findOne({ where: { discord_id: interaction.user.id } });

        if (!user) return interaction.reply('You do not have an account. Use `/register` to create one.');

        const accountEmbed = new EmbedBuilder()
                .setColor('#201E43')
                .setTitle(`${user.username}'s Account`)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription('Here is your account information.')
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields(
                { name: 'Username', value: user.username, inline: true },
                { name: 'Coins', value: `${user.coins} 🪙`, inline: true },
                { name: 'Rank', value: user.rank, inline: true }
                )
                .setTimestamp()
                .setFooter({
                    text: 'Developed by Orion',
                    iconURL: client.user.displayAvatarURL()
                });

            await interaction.editReply({ embeds: [accountEmbed] });
    }
}