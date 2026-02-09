module.exports = (sequelize, DataTypes) => {
    const Hane = sequelize.define("Hane", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        icon:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: "hanes",
        timestamps: false
    });

    Hane.associate = (models) => {
        Hane.hasMany(models.User, {
            foreignKey: "hane_id",
            as: "users"
        });
    };

    return Hane;
};
