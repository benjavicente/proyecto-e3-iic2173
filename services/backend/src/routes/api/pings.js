const KoaRouter = require('koa-router');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.use(jwtCheck);
router.use(setCurrentUser);


router.get('api.pings.all', '/all', async (ctx) => {
  const { currentUserId } = ctx.state;

  const pingedUsers = await ctx.orm.ping.findAll({ 
    where: { userIdFrom: currentUserId },
    attributes: ['id'],
    include: [
      {
        model: ctx.orm.user, 
        as: 'pingedTo', 
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }]
  });

  const usersPingedBy = await ctx.orm.ping.findAll({ 
    where: { userIdTo: currentUserId },
    attributes: ['id'],
    include: [
      {
        model: ctx.orm.user, 
        as: 'pingedFrom', 
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }]
  });

  ctx.body = {
    pingedUsers: pingedUsers,
    usersPingedBy: usersPingedBy
  }
});


router.post('api.pings.new', '/create', async (ctx) => {
  const { currentUserId } = ctx.state;
  const { pingedUserId } = ctx.request.body;

  const ping = ctx.orm.ping.build({
    userIdFrom: currentUserId,
    userIdTo: pingedUserId,
  });

  try {
    await ping.save({
      fields: [
        'userIdFrom',
        'userIdTo',
      ],
    });
  } 
  catch (ValidationError) {
    ctx.body = ValidationError;
    ctx.throw(400, ValidationError);

  }
  ctx.status = 201;
});

module.exports = router;