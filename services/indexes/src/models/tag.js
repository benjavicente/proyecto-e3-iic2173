const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    static associate(models) {
      this.belongsToMany(models.mark, { through: "marktags" });
    }
  }
  tag.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: { args: true, msg: "Este tag ya existe" },
        validate: {
          notEmpty: { args: true, msg: "Ingresa un tag válido" },
          isAlpha: { args: true, msg: "Ingresa un tag válido" },
        },
      },
    },
    {
      sequelize,
      modelName: "tag",
    }
  );

  return tag;
};
