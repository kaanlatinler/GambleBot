const { EmbedBuilder, ActionRowBuilder, ComponentType, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { User } = require('../../database/models/index');
const { CoinManagers } = require("../../../config.json");

module.exports = {
    name: "addcoin",
    description: "Add coins to a user",
    callback: async (client, interaction) => {

        if(!CoinManagers.includes(interaction.user.id)){
            return embed('Error', 'Siktir git yetkili ol pezevenk!!!', '#E72929', interaction);
        }

        const embed = (title, msg, color, i) => {
            const Embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTitle(`${title}`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${msg}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
                text: 'Developed by Orion',
                iconURL: client.user.displayAvatarURL()
            });

            i.reply({ embeds: [Embed] });
        }

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

            const coinAmountModal = new ModalBuilder()
                .setCustomId("coinAmountModal")
                .setTitle("Add Coins");

            const coinAmountInput = new TextInputBuilder()
                .setCustomId("coinAmountInput")
                .setLabel("Amount to add")
                .setStyle(TextInputStyle.Short);

            const coinAmountActionRow = new ActionRowBuilder().addComponents(coinAmountInput);

            coinAmountModal.addComponents(coinAmountActionRow);

            await collectedInteraction.showModal(coinAmountModal);

            collectedInteraction.awaitModalSubmit({
                filter: (modalInteraction) => modalInteraction.customId === "coinAmountModal",
                time: 30_000
            })
            .then(async (modalInteraction) => {
                const coinAmountValue = parseInt(modalInteraction.fields.getTextInputValue("coinAmountInput"));

                if (isNaN(coinAmountValue)) {
                    await embed('Not a Number', 'Please enter a valid number.', '#E72929', modalInteraction);
                    return;
                }

                try {
                    const targetUser = await User.findOne({
                        where: { discord_id: userId }
                    });

                    if (!targetUser) {
                        await embed('User not found', 'User not found.', '#E72929', modalInteraction);
                        return;
                    }

                    const newCoinAmount = targetUser.coins + coinAmountValue;

                    await User.update({
                        coins: newCoinAmount
                    }, {
                        where: {
                            discord_id: userId
                        }
                    });

                    await embed('Success', `Successfully added ${coinAmountValue} coins to <@${userId}>. They now have ${newCoinAmount} coins.`, '#201E43', modalInteraction);

                } catch (error) {
                    console.error(error);
                    await embed('Error', 'An error occurred while updating the user.', '#E72929', modalInteraction);
                }

            })
            .catch((err) => {
                console.error(err);
                embed('Error', 'An error occurred while adding coins.', '#E72929', collectedInteraction);
            });
        });
    }
};