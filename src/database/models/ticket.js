module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define("Ticket", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ticketNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discordId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        channelId : {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "tickets",
        timestamps: false,
    });

        
    

    return Ticket;
};