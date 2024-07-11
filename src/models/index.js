const pg = require('pg');
const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');

const db = {};

const sequelizeInstance = new Sequelize(sequelize.url, {
  dialectModule: pg,
  pool: {
    min: 0,
    max: 100,
    acquire: 30000,
    Idle: 10000,
  },
});

sequelizeInstance
  .authenticate()
  .then(() => logger.info('============== DB connected ============='))
  .catch((err) => {
    console.log(err);
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require('./user.model')(sequelizeInstance, Sequelize);
db.organization = require('./organization.model')(sequelizeInstance, Sequelize);

db.organization.belongsToMany(db.users, {
  through: 'user_org',
  as: 'users',
  foreignKey: 'organizationId',
  onDelete: 'CASCADE',
});

db.users.belongsToMany(db.organization, {
  through: 'user_org',
  as: 'organizations',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = {
  db,
};
