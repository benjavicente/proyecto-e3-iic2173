const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const users = require('./users');
const session = require('./authentication');

router.use('', session.routes());
router.use('/users', users.routes());

module.exports = router;