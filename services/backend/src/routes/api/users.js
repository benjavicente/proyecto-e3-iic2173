const KoaRouter = require('koa-router');
const { jwtCheck, setCurrentUser } = require('./middlewares/session');
// const { upload } = require('./s3/s3');

const router = new KoaRouter();


router.post('api.users.uploadImage', '/upload/image', jwtCheck, setCurrentUser, async (ctx) => {
  const { currentUserId } = ctx.state;
});

router.get('api.users.currentUser', '/me', jwtCheck, setCurrentUser, async (ctx) => {
  const { currentUserId } = ctx.state;
  const user = await ctx.orm.user.findByPk(currentUserId);
  ctx.body = user;
});


router.get('api.users.all', '/all', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  ctx.body = users;
});


router.get('api.users.profile', '/:id', async (ctx) => {
  const searchedUser = await ctx.orm.user.findByPk(ctx.params.id);
  ctx.body = searchedUser;
});


router.get('api.users.paginated', '/', async (ctx) => {
  const { page = 1, page_size: pageSize = 6 } = ctx.request.query;
  
  const users = await ctx.orm.user.findAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  ctx.body = users;
});

module.exports = router;