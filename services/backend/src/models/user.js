const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

const PASSWORD_SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.mark);
    }

    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  user.init({
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Ingresa un nombre válido' },
        isAlpha: { args: true, msg: 'Ingresa un nombre válido' },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Ingresa un apellido válido' },
        isAlpha: { args: true, msg: 'Ingresa un apellido válido' },
      },
    },
    username: {
      type: DataTypes.STRING,
      unique: { args: true, msg: 'El nombre de usuario ya está en uso' },
      validate: {
        notEmpty: { args: true, msg: 'Ingresa un nombre de usuario válido' },
        isAlpha: { args: true, msg: 'Ingresa un nombre de usuario válido' },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: { args: true, msg: 'El correo electrónico ya está en uso' },
      validate: {
        notEmpty: { args: true, msg: 'Ingresa un correo electrónico válido' },
        isEmail: { args: true, msg: 'Ingresa un correo electrónico válido' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Ingresa un número de teléfono válido' },
        is: { args: /\d{9}/, msg: 'Ingresa un número de teléfono válido'}
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Ingresa una contraseña válida' },
      },
    },
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeSave(async (instance) => {
    if (instance.changed('password')) {
      const hashedPassword = await bcrypt.hash(instance.password, PASSWORD_SALT_ROUNDS);
      instance.set('password', hashedPassword);
    }
  });

  return user;
};
