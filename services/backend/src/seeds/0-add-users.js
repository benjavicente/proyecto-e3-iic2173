module.exports = {
  up: async (queryInterface) => {
    const usersArray = [];

    usersArray.push({
      firstname: "Nicolas",
      lastname: "Meyer1",
      username: "nmeya1",
      email: "nmeya@uc.cl",
      phone: "914768523",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Angel",
      lastname: "Revilla",
      username: "dross",
      email: "dross@test.com",
      phone: "914768523",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Jose",
      lastname: "Deodo",
      username: "jose",
      email: "jose@test.com",
      phone: "968271543",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Nicolas",
      lastname: "Liñan",
      username: "vardoc",
      email: "vardoc@test.com",
      phone: "971635248",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Ivan",
      lastname: "Huerta",
      username: "ihuerta",
      email: "ihuerta@test.com",
      phone: "934725186",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Ibai",
      lastname: "Llanos",
      username: "Ibai",
      email: "ibai@test.com",
      phone: "964381257",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Jaime",
      lastname: "Altozano",
      username: "jaltozano",
      email: "altozano@test.com",
      phone: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Sergio",
      lastname: "Aguero",
      username: "aguero",
      email: "aguero@test.com",
      phone: "985136472",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "SangHyeok",
      lastname: "Lee",
      username: "Faker",
      email: "faker@test.com",
      phone: "923184675",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "Eric",
      lastname: "González",
      username: "skyshock",
      email: "skyshock@test.com",
      phone: "968425713",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersArray.push({
      firstname: "EuroGamer",
      lastname: "Spain",
      username: "eurogamerspain",
      email: "eurogamerspain@test.com",
      phone: "968425713",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    //12
    usersArray.push({
      firstname: "Fernando",
      lastname: "Balladares",
      username: "FeBalla",
      email: "fernando.balladares.03@gmail.com",
      phone: "968425713",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    //13
    usersArray.push({
      firstname: "Maggie",
      lastname: "Munoz",
      username: "MaggieM",
      email: "maggie.munoz@uc.cl",
      phone: "968425713",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert("users", usersArray);
  },
};
