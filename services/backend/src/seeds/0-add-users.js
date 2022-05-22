const bcrypt = require('bcrypt');

const PASSWORD_SALT_ROUNDS = 10;

module.exports = {
  up: async (queryInterface) => {
    const usersArray = [];

    usersArray.push({
      firstname: 'Angel',
      lastname: 'Revilla',
      username: 'dross',
      email: 'dross@test.com',
      phone: '914768523',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Jose',
      lastname: 'Deodo',
      username: 'jose',
      email: 'jose@test.com',
      phone: '968271543',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Nicolas',
      lastname: 'Liñan',
      username: 'vardoc',
      email: 'vardoc@test.com',
      phone: '971635248',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Ivan',
      lastname: 'Huerta',
      username: 'ihuerta',
      email: 'ihuerta@test.com',
      phone: '934725186',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Ibai',
      lastname: 'Llanos',
      username: 'Ibai',
      email: 'ibai@test.com',
      phone: '964381257',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Jaime',
      lastname: 'Altozano',
      username: 'jaltozano',
      email: 'altozano@test.com',
      phone: '',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Sergio',
      lastname: 'Aguero',
      username: 'aguero',
      email: 'aguero@test.com',
      phone: '985136472',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'SangHyeok',
      lastname: 'Lee',
      username: 'Faker',
      email: 'faker@test.com',
      phone: '923184675',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'Eric',
      lastname: 'González',
      username: 'skyshock',
      email: 'skyshock@test.com',
      phone: '968425713',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: 'EuroGamer',
      lastname: 'Spain',
      username: 'eurogamerspain',
      email: 'eurogamerspain@test.com',
      phone: '',
      password: bcrypt.hashSync('1234', PASSWORD_SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('users', usersArray);
  },
};