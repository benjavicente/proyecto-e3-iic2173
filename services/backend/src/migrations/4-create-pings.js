"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "pings",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userIdFrom: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        userIdTo: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        siin: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        sidi: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        dindin: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        analyticStatus: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          Items_unique: {
            fields: ["userIdFrom", "userIdTo"],
          },
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pings");
  },
};
