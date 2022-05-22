const KoaRouter = require('koa-router');

const index = require('./routes/index');
const register = require('./routes/authentication/register');
const login = require('./routes/authentication/login');
const map = require('./routes/map');
const pings = require('./routes/pings');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    switch (error.status) {
      case 401:
        ctx.app.emit('error', error, ctx);
        ctx.redirect(ctx.router.url('login.login'));
        break;
      case 403:
        ctx.app.emit('error', error, ctx);
        ctx.redirect('/');
        break;
      default:
        throw error;
    }
  }
});

router.use(async (ctx, next) => {
  if (ctx.session.currentUserId) {
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.session.currentUserId);
  }

  return next();
});

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    paths: {
      newSession: ctx.router.url('login.login'),
      destroySession: ctx.router.url('login.unlogin'),
    },
  });

  return next();
});

router.use('/', index.routes());
router.use('/register', register.routes());
router.use('/login', login.routes());
router.use('/map', map.routes());
router.use('/pings', pings.routes());

module.exports = router;
