const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: "register",
    description: "Register your account",
    callback: async (client, interaction) => {
        const { User } = require('../../database/models/index');
        const { user } = interaction;
        const { id, username } = user;

        await interaction.deferReply();

        const embed = async (title, msg, color, userToAdd, i) => {
            const Embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTitle(`${title}`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${msg}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
            { name: 'Username', value: user.username, inline: true },
            { name: 'Coins', value: `${userToAdd.coins} 🪙`, inline: true },
            { name: 'Rank', value: newUser.rank, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: 'Developed by Orion',
                iconURL: client.user.displayAvatarURL()
            });

            await i.editReply({ embeds: [Embed] });
        };

        const [newUser, created] = await User.findOrCreate({
            where: { discord_id: id },
            defaults: { username: username, coins: 1000, rank:"Veresiye Veren" }
        });

        if (created) {
            embed('Registered', 'You have been registered! 🎉', '#EEEEEE', newUser, interaction);
        } else {
            embed('Already Registered!', 'You are already registered! ⛔', '#931A25', newUser, interaction);
        }
    }
}