const { User } = require('../database/models/index');

const hourlyAward = async () => {
    const users = await getAllRegisteredUsers();
    users.forEach(user => {
        addCoins(user, 50);
    });
};

const getAllRegisteredUsers = async () => {
    const users = await User.findAll();
    return users;
};

const addCoins = async (user, amount) => {
    User.update({ coins: user.coins+amount }, {where: { discord_id: user.discord_id } });
};

module.exports = hourlyAward;