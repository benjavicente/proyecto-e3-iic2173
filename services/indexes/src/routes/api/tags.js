const KoaRouter = require("koa-router");
const sequelize = require("sequelize");
const { jwtCheck, setCurrentUser } = require("./middlewares/session");

const router = new KoaRouter();

// router.use(jwtCheck);
// router.use(setCurrentUser);

const countTags = async (markertags) => {
  const tagsCount = {};
  markertags.map((mark) => {
    mark.tags.map((tag) => {
      if (tagsCount[tag.tagId]) {
        tagsCount[tag.tagId] += 1;
      } else {
        tagsCount[tag.tagId] = 1;
      }
    });
  });
  return tagsCount;
};

// Find the centroid (simple mean) of a set of latitudes longitudes
const centroid = (markers) => {
  let latXTotal = 0;
  let latYTotal = 0;
  let lonDegreesTotal = 0;

  let currentLatLong;
  for (let i = 0; (currentLatLong = markers[i]); i++) {
    let latDegrees = currentLatLong.lat();
    let lonDegrees = currentLatLong.lng();

    let latRadians = (Math.PI * latDegrees) / 180;
    latXTotal += Math.cos(latRadians);
    latYTotal += Math.sin(latRadians);

    lonDegreesTotal += lonDegrees;
  }

  let finalLatRadians = Math.atan2(latYTotal, latXTotal);
  let finalLatDegrees = (finalLatRadians * 180) / Math.PI;

  let finalLonDegrees = lonDegreesTotal / markers.length;
  return [finalLatDegrees, finalLonDegrees];
};

const euclideanDistanceOfGeographicCoordinates = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * (Math.PI / 180); // φ, λ in radians
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

const calculateSidi = async (currenUserId, pingedUserId, ctx) => {
  const currentUserMarkers = ctx.orm.mark.findAll({
    where: { userId: currenUserId },
    include: [{ model: ctx.orm.tag, attributes: ["id", "name"] }],
  });
  const pingedUserMarkers = ctx.orm.mark.findAll({
    where: { userId: pingedUserId },
    include: [{ model: ctx.orm.tag, attributes: ["id", "name"] }],
  });
  currentUserCentroid = centroid(currentUserMarkers);
  pingedUserCentroid = centroid(pingedUserMarkers);

  return (
    (currentUserMarkers.length + pingedUserMarkers.length) /
    Math.log(
      euclideanDistanceOfGeographicCoordinates(
        currentUserCentroid[0],
        currentUserCentroid[1],
        pingedUserCentroid[0],
        pingedUserCentroid[1]
      )
    )
  );
};

const calculateSiin = async (currentUserId, pingedUserId, ctx) => {
  const currentUserMarkerTags = await ctx.orm.mark.findAll({
    where: { userId: currentUserId },
    include: [{ model: ctx.orm.tag, attributes: ["id", "name"] }],
  });

  const pingedUserMarkerTags = await ctx.orm.mark.findAll({
    where: { userId: pingedUserId },
    include: [{ model: ctx.orm.tag, attributes: ["id", "name"] }],
  });

  // count frecuency of all tags of every marker
  const currentUserTagsCount = await countTags(currentUserMarkerTags);
  const pingedUserTagsCount = await countTags(pingedUserMarkerTags);

  const tagsDifference = {};
  for (const tag in currentUserTagsCount) {
    if (pingedUserTagsCount[tag]) {
      tagsDifference[tag] = 0;
    }
  }

  for (const tag in tagsDifference) {
    tagsDifference[tag] = Math.abs(
      currentUserTagsCount[tag] - pingedUserTagsCount[tag]
    );
  }

  let dif = 0;
  for (const tag in tagsDifference) {
    dif += tagsDifference[tag];
  }

  // total tags of currentUserTagsCount
  let currentUserTagsTotal = 0;
  for (let tag in currentUserTagsCount) {
    currentUserTagsTotal += currentUserTagsCount[tag];
  }
  // total tags of pingedUserTagsCount
  let pingedUserTagsTotal = 0;
  for (let tag in pingedUserTagsCount) {
    pingedUserTagsTotal += pingedUserTagsCount[tag];
  }
  allTagsCount = currentUserTagsTotal + pingedUserTagsTotal;
  siin = (allTagsCount - dif) / allTagsCount;
  return siin;
};

const calculateDindin = async (currentUserId, pingedUserId, ctx) => {
  const siin = await calculateSiin(currentUserId, pingedUserId, ctx);
  const sidi = await calculateSidi(currentUserId, pingedUserId, ctx);
  const diin = siin * sidi;
  console.log("DIIIIN");
  console.log(siin);
  console.log(sidi);
  console.log(diin);
  return diin;
};

router.get("api.tags.calculateindex", "/:id/:id2", async (ctx) => {
  const currentUserId = ctx.params.id;
  const pingedUserId = ctx.params.id2;

  ctx.body = {
    index: await calculateDindin(currentUserId, pingedUserId, ctx),
  };
});

module.exports = router;
