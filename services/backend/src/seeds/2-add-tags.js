module.exports = {
  up: async (queryInterface) => {
    const tagsArray = [];

    tagsArray.push({
      name: "Deportes",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Naturaleza",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Comida",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Música",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Baile",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Videojuegos",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Arte",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Política",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Estudios",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Animales",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Cine",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    tagsArray.push({
      name: "Espectáculo",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert("tags", tagsArray);
  },
};
