const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ping extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        as: 'pingedFrom',
        foreignKey: {
          name: 'userIdFrom',
        },
      });

      this.belongsTo(models.user, {
        as: 'pingedTo',
        foreignKey: {
          name: 'userIdTo',
        },
      });
    }
  }
  ping.init({
    userIdFrom: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    userIdTo: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'ping',
  });

  return ping;
};
