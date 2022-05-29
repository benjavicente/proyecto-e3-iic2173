const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.get('api.tags.all', '/all', async (ctx) => {
  const tags = await ctx.orm.tag.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  ctx.body = tags;
});

module.exports = router;