const KoaRouter = require("koa-router");
const Queue = require("bull");
const { sendAnalyticsSuccessEmail, sendAnalyticsFailEmail } = require('../../mailers/example');

const router = new KoaRouter();
const indexQueue = new Queue("indexes queue", process.env.REDIS_URL);


const analyticsJob = (data) => {
  return indexQueue.add(data);
};


const calculateAnalytics = async (job) => {
  const results = {
    siin: 2,
    sidi: 2,
    dindin: 4
  };

  return results;
};


const getMarkersOfUser = async (userId, orm) => {
  const userMarkers = await orm.mark.findAll({
    where: { userId: userId },
    include: [{ model: orm.tag, attributes: ['id', 'name'] }],
  });
  return userMarkers;
};


indexQueue.process(calculateAnalytics);


router.post('api.pings.calculateAnalytics', '/queue', async (ctx) => {
  const { userIdFrom, userIdTo, pingId } = ctx.request.body;

  const userIdFromMarkers = await getMarkersOfUser(userIdFrom, ctx.orm);
  const userIdToFromMarkers = await getMarkersOfUser(userIdTo, ctx.orm);

  analyticsJob({
    userIdFromMarkers: userIdFromMarkers,
    userIdToFromMarkers: userIdToFromMarkers,
  });

  const senderUser = await ctx.orm.user.findByPk(userIdFrom);
  const recipientUser = await ctx.orm.user.findByPk(userIdTo);

  indexQueue.on('completed', async (job) => {
    const { siin, sidi, dindin } = job.returnvalue;
    try {
      await ctx.orm.ping.update(
        { siin: siin, sidi: sidi, dindin: dindin, analyticStatus: 1 },
        { where: {id: pingId } }
      );

      ctx.status = 204;
    } catch (ValidationError){
      ctx.body = ValidationError;
      ctx.throw(400, ValidationError);
    }

    const data = {
      sender : {
        firstname: senderUser.firstname,
        lastname: senderUser.lastname 
      },
      recipient: {
        firstname: recipientUser.firstname,
        lastname: recipientUser.lastname 
      },
      results: {
        siin: job.returnvalue.siin,
        sidi: job.returnvalue.sidi,
        dindin: job.returnvalue.dindin
      }
    }

    await sendAnalyticsSuccessEmail(ctx, senderUser.email, data);
  });

  indexQueue.on('failed', async (job) => {
    try {
      await ctx.orm.ping.update(
        { analyticStatus: -1 },
        { where: {id: pingId } }
      );

      const data = {
        sender : {
          firstname: senderUser.firstname,
          lastname: senderUser.lastname 
        },
        recipient: {
          firstname: recipientUser.firstname,
          lastname: recipientUser.lastname 
        }
      }
      
      await sendAnalyticsFailEmail(ctx, senderUser.email, data);
      ctx.status = 204;
    } catch (ValidationError){
      ctx.body = ValidationError;
      ctx.throw(400, ValidationError);
    }
  });
});

module.exports = router;
