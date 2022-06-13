const KoaRouter = require('koa-router');
const fetch = require("node-fetch");
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.use(jwtCheck);
router.use(setCurrentUser);


router.get('api.pings.all', '/all', async (ctx) => {
  const { currentUserId } = ctx.state;

  const pingedUsers = await ctx.orm.ping.findAll({ 
    where: { userIdFrom: currentUserId },
    attributes: ['id', 'status', 'analyticStatus', 'siin', 'sidi', 'dindin'],
    include: [
      {
        model: ctx.orm.user, 
        as: 'pingedTo', 
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }]
  });

  const usersPingedBy = await ctx.orm.ping.findAll({ 
    where: { userIdTo: currentUserId },
    attributes: ['id', 'status', 'analyticStatus', 'siin', 'sidi', 'dindin'],
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

  if (currentUserId === pingedUserId){
    ctx.throw(400, 'Lo sentimos, pero no puedes enviarte un ping a ti mismo');
  }

  const ping = ctx.orm.ping.build({
    userIdFrom: currentUserId,
    userIdTo: pingedUserId,
    status: 0,
    analyticStatus: 0,
  });

  try {
    await ping.save({
      fields: [
        'userIdFrom',
        'userIdTo',
        'status',
        'analyticStatus',
      ],
    });

    ctx.status = 201;
  } 
  catch (ValidationError) {
    ctx.body = ValidationError;
    ctx.throw(400, ValidationError);
  }

  const { id: pingId } = await ctx.orm.ping.findOne({
    where: { userIdFrom: currentUserId, userIdTo: pingedUserId }
  });

  const analyticsBody = {
    userIdFrom: currentUserId,
    userIdTo: pingedUserId,
    pingId: pingId,
  }

  try {
    await fetch(`${process.env.INDEX_HOST}/api/analytics/indexes`,
      {
        method: 'POST',
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsBody),
      }
    )
  } catch (error) {
    ctx.body = error;
    ctx.throw(400, error);
  }
});


router.patch('api.pings.updateStatus', '/update/:id', async (ctx) => {
  const { currentUserId } = ctx.state;
  const { status } = ctx.request.body;

  const ping = await ctx.orm.ping.findByPk(ctx.params.id);

  if (!ping){
    ctx.throw(404, 'El ping indicado no existe');
  }

  if (ping.userIdTo !== currentUserId){
    ctx.throw(403, 'No puedes acceder a esta información');
  }

  if (!status && status !== 0){
    ctx.throw(400, 'Debes ingresar un nuevo estado para el ping');
  }

  try {
    await ctx.orm.ping.update({ status: status }, { where: {id: ctx.params.id } });
    ctx.status = 204;
  } catch (ValidationError){
    ctx.body = ValidationError;
    ctx.throw(400, ValidationError);
  }
});

module.exports = router;