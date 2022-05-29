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

  const userMarkers = await ctx.orm.mark.findAll({ 
    where: { userId: currentUserId },
    attributes: ['id', 'name', 'position', 'createdAt'],
    include: [{ 
      association: 'tags',
      attributes: ['id', 'name'],
      through: { attributes: [] }
    }],
  });

  const peopleMarkers = await ctx.orm.mark.findAll({ 
    where: {
      userId: { 
        [sequelize.Op.not]: currentUserId, 
        [sequelize.Op.in]: filteredIds,
      }},
    attributes:  ['id', 'name', 'position', 'createdAt'],
    include: [
      { model: ctx.orm.user, attributes: ['id', 'username'] },
      { 
        association: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    ],
  });

  ctx.body = {
    userMarkers: userMarkers,
    peopleMarkers: peopleMarkers,
  };
});

router.post('api.markers.new', '/create', async (ctx) => {
  const { currentUserId } = ctx.state;
  const { lat, lng, name, tagsIds = [] } = ctx.request.body;

  const tags = await ctx.orm.tag.findAll({
    where: { id: { [sequelize.Op.in]: tagsIds }}
  })

  if (tags.length !== tagsIds.length){
    ctx.throw(400, 'Lista de tags inválida');
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