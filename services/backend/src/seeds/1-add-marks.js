const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const marksArray = [];

    marksArray.push({
      userId: 1,
      name: 'Gimnasio',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.609663 -70.577192)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 1,
      name: 'Universidad',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.499890 -70.612871)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 1,
      name: 'Pizzería',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.500593 -70.615969)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 2,
      name: 'Colegio',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.627027 -70.577078)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 3,
      name: 'Mecánico',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.597196 -70.577367)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 3,
      name: 'Trabajo',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.485553 -70.595039)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 4,
      name: 'Yoga',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.398478 -70.602042)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 4,
      name: 'Música',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.416381 -70.603000)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 5,
      name: 'Fútbol',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.463911 -70.609203)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    marksArray.push({
      userId: 6,
      name: 'Bar',
      position: Sequelize.fn('ST_GeomFromText', 'POINT(-33.423951 -70.611205)'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('marks', marksArray);
  },
};