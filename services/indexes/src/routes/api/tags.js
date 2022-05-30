const KoaRouter = require("koa-router");
const sequelize = require("sequelize");

const router = new KoaRouter();
const Queue = require("bull");

const indexQueue = new Queue("indexes queue", process.env.REDIS_URL); // Specify Redis connection using object
const CalculateIndexJob = (data) => {
  return indexQueue.add(data);
};

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
const centroid = async (markers) => {
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

const calculateSidi = async (userIdFromMarkers, userIdToMarkers) => {
  currentUserCentroid = await centroid(userIdFromMarkers);
  pingedUserCentroid = await centroid(userIdToMarkers);

  const numerador = userIdFromMarkers.length + userIdToMarkers.length;
  const denominador = Math.log(
    euclideanDistanceOfGeographicCoordinates(
      currentUserCentroid[0],
      currentUserCentroid[1],
      pingedUserCentroid[0],
      pingedUserCentroid[1]
    )
  );
  let sidi = numerador / denominador;
  return sidi;
};

const calculateSiin = async (userIdFromMarkers, userIdToMarkers) => {
  // count frecuency of all tags of every marker
  const currentUserTagsCount = { deportes: 2 }; // await countTags(userIdFromMarkers);
  const pingedUserTagsCount = { deportes: 3 }; // await countTags(userIdToMarkers);

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

const calculateDindin = async (job) => {
  return { siin: 2, sidi: 2, diin: 4 };
  data = job.data;
  userIdFromMarkers = data.userIdFromMarkers;
  userIdToMarkers = data.userIdToMarkers;

  let siin = await calculateSiin(userIdFromMarkers, userIdToMarkers);
  let sidi = await calculateSidi(userIdFromMarkers, userIdToMarkers);
  if (siin === NaN) {
    siin = 0;
  }
  if (sidi === NaN) {
    sidi = 0;
  }
  const diin = siin * sidi;
  console.log("final diin: ", diin);

  return { siin: siin, sidi: sidi, diin: diin };
};

const getMarkersOfUser = async (userId, ctx) => {
  const userMarkers = await ctx.orm.mark.findAll({
    where: { userId: userId },
    include: [{ model: ctx.orm.tag, attributes: ["id", "name"] }],
  });
  return userMarkers;
};

indexQueue.process(calculateDindin);

router.get("api.tags.calculateindex", "/:userIdFrom/:userIdTo", async (ctx) => {
  const { userIdFrom, userIdTo } = ctx.params;

  const userIdFromMarkers = await getMarkersOfUser(userIdFrom, ctx);
  const userIdToFromMarkers = await getMarkersOfUser(userIdTo, ctx);

  // console.log("calculateindex");
  // const currentUserId = ctx.params.id;
  // const pingedUserId = ctx.params.id2;
  CalculateIndexJob({
    userIdFromMarkers: userIdFromMarkers,
    userIdToFromMarkers: userIdToFromMarkers,
  });
  indexQueue.on("completed", (job) => {
    // actualizar el indexesStatus de el ping correspondiente a los dos usuarios
    //
    // ctx.orm.ping.update(
    //   { indexesStatus: "pinged", diin: job.returnvalue.diin },
    //   { where: { userId: userIdTo } }
    // );

    console.log(job.returnvalue);
    console.log(`Job with id ${job.id} has been completed`);
  });
  indexQueue.on("failed", (job) => {
    console.log(`Job with id ${job.id} has been failed`);
    // ctx.body = {
    //   message: "error",
    // };
  });
  ctx.body = {
    userIdFromMarkers,
    userIdToFromMarkers,
  };
});

module.exports = router;
