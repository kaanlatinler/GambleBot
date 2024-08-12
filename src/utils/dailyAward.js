const { User } = require('../database/models/index');

const dailyAward = async () => {
    const users = await getAllRegisteredUsers();
    users.forEach(user => {
        addCoins(user, 400);
    });
};

const getAllRegisteredUsers = async () => {
    const users = await User.findAll();
    return users;
};

const addCoins = async (user, amount) => {
    User.update({ coins: user.coins+amount }, {where: { discord_id: user.discord_id } });
};

module.exports = dailyAward;