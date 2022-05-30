const KoaRouter = require("koa-router");
const sequelize = require("sequelize");

const router = new KoaRouter();

router.get("api.pings.all", "/", async (ctx) => {
  const pingedUsers = await ctx.orm.ping.findAll({
    where: { userIdFrom: ctx.state.currentUserId },
    include: [{ model: ctx.orm.user, as: "pingedTo" }],
  });

  const usersPingedBy = await ctx.orm.ping.findAll({
    where: { userIdTo: ctx.state.currentUserId },
    include: [{ model: ctx.orm.user, as: "pingedFrom" }],
  });

  ctx.body = {
    pingedUsers: pingedUsers,
    usersPingedBy: usersPingedBy,
  };
});

router.post("api.pings.new", "/", async (ctx) => {
  const { pingedUserId } = ctx.request.body;

  const ping = ctx.orm.ping.build({
    userIdFrom: ctx.state.currentUserId,
    userIdTo: pingedUserId,
  });

  try {
    await ping.save({
      fields: ["userIdFrom", "userIdTo"],
    });
  } catch (ValidationError) {
    ctx.body = ValidationError;
    ctx.throw(400, ValidationError);
  }
  ctx.status = 200;
});

module.exports = router;
