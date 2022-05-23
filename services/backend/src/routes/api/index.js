const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const users = require('./users');
const authentication = require('./authentication');

router.use('/users', users.routes());
router.use('', authentication.routes());

module.exports = router;