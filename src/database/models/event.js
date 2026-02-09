// database/models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING, // "20:00"
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    links: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING, // discord_id
      allowNull: false
    }
  });

  return Event;
};
