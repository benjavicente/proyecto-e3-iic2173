const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class image extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }
  image.init({
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Ingresa una url de imagen válida' },
        isUrl: { args: true, msg: 'Ingresa una url de imagen válida' },
      },
    },
  }, {
    sequelize,
    modelName: 'image',
  });

  return image;
};
