const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.get('register', '/', async (ctx) => {
  await ctx.render('authentication/register', {
    submitPath: ctx.router.url('register.new'),
    hideNavLoginButton: true,
  });
});

router.post('register.new', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  const { email } = user;

  try {
    await user.save({
      fields: [
        'firstname',
        'lastname',
        'username',
        'email',
        'phone',
        'password',
      ],
    });

    const newUser = await ctx.orm.user.findOne({ where: { email } });

    ctx.session.currentUserId = newUser.id;
    ctx.redirect('/');
  } 
  catch (ValidationError) {
    await ctx.render('authentication/register', {
      submitPath: ctx.router.url('register.new'),
      hideNavLoginButton: true,
      errors: ValidationError.errors,
      user: user,
    });
  }
});

module.exports = router;
