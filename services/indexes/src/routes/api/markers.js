const KoaRouter = require('koa-router');
const sequelize = require('sequelize');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.use(jwtCheck);
router.use(setCurrentUser);

router.get('api.markers.all', '/', async (ctx) => {
  const { currentUserId } = ctx.state;
  let { filteredIds } = ctx.request.query;

  if (filteredIds){
    filteredIds = JSON.parse(filteredIds);
  } else {
    filteredIds = [];
  }
  
  if (filteredIds.length > 5){
    ctx.throw(400, 'Solo se puede filtrar para un máximo de 5 usuarios');
  }

  const userPositions = await ctx.orm.mark.findAll({ 
    where: { userId: currentUserId },
    include: [{ model: ctx.orm.tag, attributes: ['id', 'name'] }],
  });

  const peoplePositions = await ctx.orm.mark.findAll({ 
    where: {
      userId: { 
        [sequelize.Op.not]: currentUserId, 
        [sequelize.Op.in]: filteredIds,
      }},
    include: [
      { model: ctx.orm.user, attributes: ['id', 'username'] },
      { model: ctx.orm.tag, attributes: ['id', 'name'] }
    ],
  });

  ctx.body = {
    userPositions: userPositions,
    peoplePositions: peoplePositions,
  };
});

router.post('api.markers.new', '/new', async (ctx) => {
  const { currentUserId } = ctx.state;
  const { lat = 33, lng = 33, name, filteredTags = [] } = ctx.request.body;

  const tags = await ctx.orm.tag.findAll({
    where: { id: { [sequelize.Op.in]: filteredTags }}
  })

  if (tags.length !== filteredTags.length){
    ctx.throw(400, 'Lista de filtro de tags inválida');
  }

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

  await mark.addTags(tags);
  ctx.status = 201;
});


module.exports = router;