const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../../config.json');
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect
});

const User = require('./user')(sequelize, DataTypes);
const Log = require('./log')(sequelize, DataTypes);

User.associate({ Log });;
Log.associate({ User });

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = { User, Log };
