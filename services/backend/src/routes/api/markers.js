const KoaRouter = require('koa-router');
const sequelize = require('sequelize');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.use(jwtCheck);
router.use(setCurrentUser);

router.get('api.markers.all', '/', async (ctx) => {
  const { currentUserId } = ctx.state;
  let { filteredIds = [] } = ctx.request.query;
  filteredIds = JSON.parse(filteredIds);

  if (filteredIds.length > 5){
    ctx.throw(400, 'Solo se puede filtrar para un máximo de 5 usuarios');
  }

  const userPositions = await ctx.orm.mark.findAll({ 
    where: { userId: currentUserId },
  });

  const peoplePositions = await ctx.orm.mark.findAll({ 
    where: {
      userId: { 
        [sequelize.Op.not]: currentUserId, 
        [sequelize.Op.in]: filteredIds,
      }},
    include: [{ model: ctx.orm.user, attributes: ['id', 'username'] }],
  });

  ctx.body = {
    userPositions: userPositions,
    peoplePositions: peoplePositions,
  };
});

router.post('api.markers.new', '/new', async (ctx) => {
  const { currentUserId } = ctx.state;
  const { lat, lng, name } = ctx.request.body;

  const mark = ctx.orm.mark.build({
    userId: currentUserId,
    name: name,
    position: { type: 'point', 'coordinates': [lat, lng] },
  });

  try {
    await mark.save({
      fields: [
        'userId',
        'name',
        'position',
      ],
    });
  } catch (ValidationError) {
    ctx.body = ValidationError;
    ctx.throw(400, ValidationError);
  }
  ctx.status = 201;
});


module.exports = router;