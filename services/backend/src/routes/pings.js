const KoaRouter = require('koa-router');
const { checkSession } = require('../middlewares/authentication');

const router = new KoaRouter();

router.use(checkSession);

router.get('pings', '/', async (ctx) => {
  const pingedUsers = await ctx.orm.ping.findAll({ 
    where: { userIdFrom: ctx.session.currentUserId },
    include: [{ model: ctx.orm.user, as: 'pingedTo' }]
  });

  const usersPingedBy = await ctx.orm.ping.findAll({ 
    where: { userIdTo: ctx.session.currentUserId },
    include: [{ model: ctx.orm.user, as: 'pingedFrom' }]
  });

  await ctx.render('pings', {
    pingedUsers: pingedUsers,
    usersPingedBy: usersPingedBy,
  });
});


router.post('pings.addPing', '/', async (ctx) => {
  const { userIdTo } = ctx.request.body;

  const ping = ctx.orm.ping.build({
    userIdFrom: ctx.session.currentUserId,
    userIdTo: userIdTo,
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
    console.log(ValidationError);
  }
  finally {
    ctx.redirect('/map');
  }
});


router.del('map.delPing', '/', async (ctx) => {
  const { pingId } = ctx.request.body;

  try {
    await ctx.orm.ping.destroy({
      where: { id: pingId, userIdFrom: ctx.session.currentUserId }
    });
  }
  catch (ValidationError) {
    console.log(ValidationError);
  }
  finally {
    ctx.redirect('/pings');
  }
});

module.exports = router;
