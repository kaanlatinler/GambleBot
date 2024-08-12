module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      change: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  
    Log.associate = function(models) {
      Log.belongsTo(models.User, { foreignKey: 'user_id' });
    };  
  
    return Log;
  };
  