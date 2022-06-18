const KoaRouter = require('koa-router');
const { jwtCheck, setCurrentUser } = require('./middlewares/session')

const router = new KoaRouter();

router.use(jwtCheck);
router.use(setCurrentUser);

router.post('api.handleUserSession', '/authenticate', async (ctx) => {
  const { currentUserId } = ctx.state;
  const user = await ctx.orm.user.findByPk(currentUserId, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  ctx.body = user;
});

module.exports = router;