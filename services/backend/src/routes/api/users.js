const KoaRouter = require('koa-router');
const { jwtCheck } = require('./middlewares/auth')

const router = new KoaRouter();

router.get('api.users.public', '/public', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  ctx.body = users;
});

router.use(jwtCheck);

router.get('api.users.private', '/private', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  ctx.body = users;
});

module.exports = router;