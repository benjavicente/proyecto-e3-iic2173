module.exports = {
  up: async (queryInterface) => {
    const pingsArray = [];

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 2,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 3,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 1,
      userIdTo: 4,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 2,
      userIdTo: 1,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 3,
      userIdTo: 4,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 3,
      userIdTo: 1,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 4,
      userIdTo: 1,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    pingsArray.push({
      userIdFrom: 4,
      userIdTo: 3,
      status: 0,
      analyticStatus: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('pings', pingsArray);
  },
};