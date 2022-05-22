const KoaRouter = require('koa-router');
const sequelize = require('sequelize');
const { checkSession } = require('../middlewares/authentication');

const router = new KoaRouter();

router.use(checkSession);

router.get('map', '/', async (ctx) => {
  const userPositions = await ctx.orm.mark.findAll({ 
    where: { userId: ctx.session.currentUserId },
  });

  const peoplePositions = await ctx.orm.mark.findAll({ 
    where: {userId: { [sequelize.Op.not]: ctx.session.currentUserId }},
    include: [{ model: ctx.orm.user, attributes: ['id', 'username'] }],
  });

  await ctx.render('map', {
    newMarkerSubmitPath: ctx.router.url('map.addPosition'),
    delMarkerSubmitPath: ctx.router.url('map.delPosition'),
    userPositions: userPositions,
    peoplePositions: peoplePositions,
  });
});


router.post('map.addPosition', '/', async (ctx) => {
  const { name, lat, long } = ctx.request.body;

  const mark = ctx.orm.mark.build({
    userId: ctx.session.currentUserId,
    name: name,
    position: { type: 'point', 'coordinates': [lat, long] },
  });

  try {
    await mark.save({
      fields: [
        'userId',
        'name',
        'position',
      ],
    });

    ctx.redirect('/map');
  } 
  catch (ValidationError) {
    const userPositions = await ctx.orm.mark.findAll({ 
      where: { userId: ctx.session.currentUserId } 
    });
  
    const peoplePositions = await ctx.orm.mark.findAll({ 
      where: {userId: { [sequelize.Op.not]: ctx.session.currentUserId }},
      include: [{ model: ctx.orm.user, attributes: ['username'] }],
    });

    await ctx.render('map', {
      newMarkerSubmitPath: ctx.router.url('map.addPosition'),
      delMarkerSubmitPath: ctx.router.url('map.delPosition'),
      userPositions: userPositions,
      peoplePositions: peoplePositions,
      errors: ValidationError.errors,
    });
  }
});


router.del('map.delPosition', '/', async (ctx) => {
  const { markerId } = ctx.request.body;
  
  try {
    await ctx.orm.mark.destroy({
      where: { id: markerId, userId: ctx.session.currentUserId }
    });
  }
  catch (ValidationError) {
    console.log(ValidationError);
  }
  finally {
    ctx.redirect('/map');
  }
});

module.exports = router;
