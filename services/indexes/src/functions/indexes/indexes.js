const sequelize = require('sequelize');


const getMarkersOfUser = async (userId, orm) => {
  const userMarkers = await orm.mark.findAll({
    where: { userId: userId },
    include: [{ model: orm.tag, attributes: ['id', 'name'] }],
  });

  return userMarkers;
};


const getCentroidOfUserMarkers = async (userId, orm) => {
  const { centroid } = await orm.user.findOne({
    where: { id: userId }, 
    group: ['user.id'], 
    attributes: [
      'user.id',
      [
        sequelize.fn(
          'ST_Centroid',
          sequelize.fn('ST_Collect', sequelize.col('marks.position'))
        ),
        'centroid'
      ]
    ], 
    include: [{ model:  orm.mark, attributes: [] }],
    raw: true
  });

  const centroidCoordinates = {
    lat: centroid.coordinates[0],
    lng: centroid.coordinates[1],
  }

  return centroidCoordinates;
};


const getRequiredDataForIndexes = async (senderUserId, recipientUserId, orm) => {
  const senderMarkers = await getMarkersOfUser(senderUserId, orm);
  const recipientMarkers = await getMarkersOfUser(recipientUserId, orm);

  const senderCentroid = await getCentroidOfUserMarkers(senderUserId, orm);
  const recipientCentroid = await getCentroidOfUserMarkers(recipientUserId, orm);

  const requiredData = {
    senderMarkers: senderMarkers,
    recipientMarkers: recipientMarkers,
    senderCentroid: senderCentroid,
    recipientCentroid: recipientCentroid,
    totalMarkers: senderMarkers.length + recipientMarkers.length,
  };

  return requiredData;
};

module.exports = { getRequiredDataForIndexes };