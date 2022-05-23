const KoaRouter = require('koa-router');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.get('api.users.public', '/public', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  ctx.body = users;
});

router.use(jwtCheck);
router.use(setCurrentUser);

router.get('api.users.profile', '/profile', async (ctx) => {
  const { currentUserId } = ctx.state;
  const user = await ctx.orm.user.findByPk(currentUserId);
  ctx.body = user;
});

module.exports = router;