const { User } = require("../../database/models");
const { getCard } = require('../../utils/gamble/cardGame/getCard');

module.exports = {
    name: 'cardgame',
    description: 'Play a card game with the bot',
    options: [
        {
            name: 'bet',
            type: 1,
            description: 'The amount of money you want to bet',
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        const user = User.findOne({ where: { discordId: interaction.user.id } });

        if (!user) {
            return interaction.reply('You need to register first. Use the /register command');
        }

        const bet = interaction.options.getInteger('bet');

        if (bet < 1 || bet > user.coins) {
            return interaction.reply('You need to bet at least 1 coin');
        }

        const userCard = getCard();
        const botCard = getCard();

        if(userCard.card > botCard.card) {
            user.coins += bet * 2;
            await user.save();
            return interaction.reply(`You won! Your card: ${userCard.card}, Bot's card: ${botCard.card}. You now have ${user.coins} coins`);
        } else if (userCard.card < botCard.card) {
            user.coins -= bet;
            await user.save();
            return interaction.reply(`You lost! Your card: ${userCard.card}, Bot's card: ${botCard.card}. You now have ${user.coins} coins`);
        } else {
            return interaction.reply(`It's a tie! Your card: ${userCard.card}, Bot's card: ${botCard.card}. You still have ${user.coins} coins`);
        }
    }
};