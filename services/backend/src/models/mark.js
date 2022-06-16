const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class mark extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: "userId" });
      this.belongsToMany(models.tag, { through: "marktags" });
    }
  }
  mark.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { args: true, msg: "Ingresa un nombre válido" },
        },
      },
      position: {
        type: DataTypes.GEOMETRY("POINT"),
        validate: {
          notEmpty: { args: true, msg: "Ingresa unas coordenadas válidas" },
        },
      },
    },
    {
      sequelize,
      modelName: "mark",
    }
  );

  return mark;
};
