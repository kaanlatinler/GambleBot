const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../../config.json');

const sequelize = new Sequelize(config.development.connStr, {
    logging: false
});

// MODELLERİ YÜKLE
const User = require('./user')(sequelize, DataTypes);
const Log  = require('./log')(sequelize, DataTypes);
const Hane = require('./hane')(sequelize, DataTypes);
const Ticket = require('./ticket')(sequelize, DataTypes);
const TicketTranscript = require('./ticketTranscript')(sequelize, DataTypes);

// ASSOCIATIONS (SIRASI ÖNEMLİ)
User.associate({ Log, Hane });
Log.associate({ User });
Hane.associate({ User });

// 🔥 ALTER TRUE → TABLOYU OLUŞTURUR
sequelize.sync().then(() => {
    console.log('✅ Database synced');
}).catch(console.error);

module.exports = {
    sequelize,
    User,
    Log,
    Hane,
    Ticket,
    TicketTranscript
};
