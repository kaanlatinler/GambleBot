const { Log } = require("../database/models");

module.exports = async ({ action, userId }) => {

    
    await Log.create({
        action,
        user_id: userId || null
    });
};
