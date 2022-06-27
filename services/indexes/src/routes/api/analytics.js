const KoaRouter = require("koa-router");
const Queue = require("bull");
const {
  sendAnalyticsSuccessEmail,
  sendAnalyticsFailEmail,
} = require("../../mailers/example");
const { calculateSiinIndex } = require("../../functions/indexes/siin");
const { calculateSidiIndex } = require("../../functions/indexes/sidi");
const {
  getRequiredDataForIndexes,
} = require("../../functions/indexes/indexes");

const router = new KoaRouter();
const indexQueue = new Queue("indexes queue", process.env.REDIS_URL);
const uuid_gen = require("uuid");

const analyticsJob = (data) => {
  if (data.cronTime) {
    const uuid = uuid_gen.v1();
    return indexQueue.add(data, {
      repeat: { cron: data.cronTime },
      jobId: uuid,
    });
  } else {
    return indexQueue.add(data);
  }
};

const calculateAnalytics = async (job) => {
  console.log("calculateAnalytics");
  if (job.opts.repeat.count == 1) {
    console.log("calculateAnalytics - first time");
  }

  const { senderMarkers, recipientMarkers } = job.data;
  const siin = await calculateSiinIndex(senderMarkers, recipientMarkers);

  const { senderCentroid, recipientCentroid, totalMarkers } = job.data;
  const sidi = await calculateSidiIndex(
    senderCentroid,
    recipientCentroid,
    totalMarkers
  );

  const results = {
    siin: siin.toFixed(2),
    sidi: sidi.toFixed(2),
    dindin: (siin * sidi).toFixed(2),
  };

  return results;
};

indexQueue.process(calculateAnalytics);

router.post("api.pings.calculateAnalytics", "/indexes", async (ctx) => {
  const { userIdFrom, userIdTo, pingId, cronTime } = ctx.request.body;

  const requiredData = await getRequiredDataForIndexes(
    userIdFrom,
    userIdTo,
    cronTime,
    ctx.orm
  );
  if (!requiredData) {
    ctx.throw(400, "No se pudo calcular el índice");
  }
  analyticsJob(requiredData);
  const senderUser = await ctx.orm.user.findByPk(userIdFrom);
  const recipientUser = await ctx.orm.user.findByPk(userIdTo);

  let requestData = {
    sender: {
      firstname: senderUser.firstname,
      lastname: senderUser.lastname,
    },
    recipient: {
      firstname: recipientUser.firstname,
      lastname: recipientUser.lastname,
    },
  };

  indexQueue.on("completed", async (job) => {
    const { siin, sidi, dindin } = job.returnvalue;

    try {
      await ctx.orm.ping.update(
        { siin: siin, sidi: sidi, dindin: dindin, analyticStatus: 1 },
        { where: { id: pingId } }
      );

      ctx.status = 204;
    } catch (ValidationError) {
      ctx.body = ValidationError;
      ctx.throw(400, ValidationError);
    }

    if (job.opts.repeat.count == 1) {
      requestData.results = { siin: siin, sidi: sidi, dindin: dindin };
      await sendAnalyticsSuccessEmail(
        ctx,
        senderUser.email,
        requestData,
        "sender"
      );
      await sendAnalyticsSuccessEmail(
        ctx,
        recipientUser.email,
        requestData,
        "recipient"
      );
    }
  });

  indexQueue.on("failed", async (job) => {
    console.log("job failed");

    try {
      await ctx.orm.ping.update(
        { analyticStatus: -1 },
        { where: { id: pingId } }
      );

      await sendAnalyticsFailEmail(
        ctx,
        senderUser.email,
        requestData,
        "sender"
      );
      await sendAnalyticsFailEmail(
        ctx,
        recipientUser.email,
        requestData,
        "recipient"
      );

      ctx.status = 204;
    } catch (ValidationError) {
      ctx.body = ValidationError;
      ctx.throw(400, ValidationError);
    }
  });
});

module.exports = router;
