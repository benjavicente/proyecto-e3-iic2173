const KoaRouter = require('koa-router');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.get('api.users.profile', '/:id', async (ctx) => {
  const searchedUser = await ctx.orm.user.findByPk(ctx.params.id);
  ctx.body = searchedUser;
});

router.get('api.users.all', '/', async (ctx) => {
  const { page = 1, page_size: pageSize = 6 } = ctx.request.query;
  
  const users = await ctx.orm.user.findAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  ctx.body = users;
});

router.use(jwtCheck);
router.use(setCurrentUser);

router.get('api.users.profile', '/me', async (ctx) => {
  const { currentUserId } = ctx.state;
  const user = await ctx.orm.user.findByPk(currentUserId);
  ctx.body = user;
});

module.exports = router;