'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP EXTENSION IF EXISTS postgis;');
  }
};
