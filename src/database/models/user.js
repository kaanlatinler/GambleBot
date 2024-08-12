module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: false
      },
    });
  
    User.associate = function(models) {
      User.hasMany(models.Log, { foreignKey: 'user_id' });
    };
  
    return User;
  };
  