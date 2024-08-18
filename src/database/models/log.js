module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      desc: {
        type: DataTypes.STRING,
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
  