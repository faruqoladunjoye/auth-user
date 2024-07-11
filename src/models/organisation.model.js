const Sequelize = require('sequelize');

module.exports = (sequelize, dataType) => {
  const organisation = sequelize.define('organisation', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: dataType.STRING,
      allowNull: false,
    },

    description: {
      type: dataType.STRING,
    },
  });

  return organisation;
};
