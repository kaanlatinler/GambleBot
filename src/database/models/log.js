module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // ← Bunu eklemezsen hep 0 gelir
}
,
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING, // <-- INTEGER yerine BIGINT
      allowNull: true
    }
  });

  Log.associate = models => {
    Log.belongsTo(models.User, {
      foreignKey: "discord_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    });
  };

  return Log;
};
