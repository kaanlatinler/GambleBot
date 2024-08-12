const { EmbedBuilder, UserSelectMenuBuilder, ActionRowBuilder, ComponentType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'accountuser',
    description: 'Account a user',
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    callback: async (client, interaction) => {

        const { User } = require('../../database/models/index');

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

            const user = await User.findOne({ where: { discord_id: userId } });

            if (!user) return collectedInteraction.reply('This user does not have an account.');
    
            const accountEmbed = new EmbedBuilder()
            .setColor('#201E43')
            .setTitle(`${user.username}'s Account`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription('Here is your account information.')
            .setThumbnail(targetUser.user.displayAvatarURL())
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

            await collectedInteraction.reply({ embeds: [accountEmbed] });
        });
    }
}