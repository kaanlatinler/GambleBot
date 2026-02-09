// database/models/TicketTranscript.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("TicketTranscript", {
        ticketId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        }
    });
};
