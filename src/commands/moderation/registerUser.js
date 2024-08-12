const { EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');


module.exports = {
    name: "registeruser",
    description: "Register an User account",
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    callback: async (client, interaction) => {

        const { User } = require('../../database/models/index');

        const embed = async (title, msg, color, userToAdd, i, u) => {
            const Embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTitle(`${title}`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${msg}`)
            .setThumbnail(u.displayAvatarURL())
            .addFields(
            { name: 'Username', value: u.username, inline: true },
            { name: 'Coins', value: `${userToAdd.coins} 🪙`, inline: true },
            { name: 'Rank', value: userToAdd.rank, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: 'Developed by Orion',
                iconURL: client.user.displayAvatarURL()
            });

            await i.reply({ embeds: [Embed] });
        };

        const userSelect = new UserSelectMenuBuilder()
        .setCustomId(interaction.id);

        const actionRow = new ActionRowBuilder().addComponents(userSelect);

        const reply = await interaction.reply({ components: [actionRow] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.UserSelect,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000
        });

        collector.on('collect', async (collectedInteraction) => {
            if (!collectedInteraction.values.length) {
                collectedInteraction.reply({ content: 'Please select a user.', ephemeral: true });
                return;
            }

            const userId = collectedInteraction.values[0];

            const guild = interaction.guild;

            const targetUser = guild.members.cache.get(userId);

            const [newUser, created] = await User.findOrCreate({
                where: { discord_id: userId },
                defaults: { username: targetUser.user.username, coins: 1000, rank:"Veresiye Veren" }
            });
    
            if (created) {
                embed('Registered', 'You have been registered! 🎉', '#EEEEEE', newUser, collectedInteraction, targetUser.user);
            } else {
                embed('Already Registered!', 'You are already registered! ⛔', '#931A25', newUser, collectedInteraction, targetUser.user);
            }
        });
    }
}