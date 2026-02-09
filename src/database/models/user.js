module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        discord_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hane_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "hanes",
                key: "id"
            }
        },
        name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull: true
        },
        age:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bannerlord_hours:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        bannerlord_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        old_servers:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        steamOrEpicId:{
            type: DataTypes.STRING,
            allowNull: true
        },
        referencesUsers:{
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: "users",
        timestamps: false
    });

    User.associate = (models) => {
        User.belongsTo(models.Hane, {
            foreignKey: "hane_id",
            as: "hane"
        });

        User.hasMany(models.Log, {
            foreignKey: "discord_id",
            as: "logs"
        });
    };

    return User;
};
