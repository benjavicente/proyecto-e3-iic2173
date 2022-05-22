const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.get('login', '/', async (ctx) => ctx.render(
  'authentication/login', {
    submitPath: ctx.router.url('login.login'),
    hideNavLoginButton: true,
  },
));

router.post('login.login', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });

  const isAuthenticated = user && await user.checkPassword(password);

  if (isAuthenticated) {
    ctx.session.currentUserId = user.id;
    ctx.redirect('/');
  } else {
    await ctx.render('authentication/login', {
      submitPath: ctx.router.url('login.login'),
      errors: 'Correo electrónico y/o contraseña incorrectos',
      email: email,
      hideNavLoginButton: true,
    });
  }
});

router.del('login.unlogin', '/', (ctx) => {
  ctx.session.currentUserId = null;
  ctx.redirect('/');
});

module.exports = router;