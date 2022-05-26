module.exports = {
  up: async (queryInterface) => {
    const pingsArray = [];

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 2,
      userIdTo: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 3,
      userIdTo: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 3,
      userIdTo: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 4,
      userIdTo: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 4,
      userIdTo: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('pings', pingsArray);
  },
};