const getEuclideanDistanceOfGeoCoordinates = async (point1, point2) => {
  const R = 6371e3;

  const l1 = point1.lat * (Math.PI / 180);
  const l2 = point2.lat * (Math.PI / 180);
  
  const latDiff = (point2.lat - point1.lat) * (Math.PI / 180);
  const lngDiff = (point2.lng - point1.lng) * (Math.PI / 180);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(l1) * Math.cos(l2) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


const calculateSidiIndex = async (senderCentroid, recipientCentroid, totalMarkers) => {
  const distance = await getEuclideanDistanceOfGeoCoordinates(senderCentroid, recipientCentroid);
  const sidi = totalMarkers / Math.log(distance);
  return sidi;
};

module.exports = { calculateSidiIndex };