const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "register",
    description: "Register your account",
    callback: async (client, interaction) => {
        const { User } = require('../../database/models/index');
        const { user } = interaction;
        const { id, username } = user;

        await interaction.deferReply();

        const embed = async (title, msg, color, userData, i) => {
            const Embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(msg)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'Username', value: user.username, inline: true },
                    { name: 'Hane', value: userData.hane, inline: true }
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
            defaults: {
                username: username,
                hane: "Bilinmiyor" // veya istediğin default değer
            }
        });

        if (created) {
            embed(
                'Registered',
                'You have been successfully registered! 🏠',
                '#2ECC71',
                newUser,
                interaction
            );
        } else {
            embed(
                'Already Registered!',
                'You are already registered! ⛔',
                '#E74C3C',
                newUser,
                interaction
            );
        }
    }
};
