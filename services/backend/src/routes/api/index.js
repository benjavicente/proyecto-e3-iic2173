const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const authentication = require('./authentication');
const users = require('./users');
const pings = require('./pings')

router.use('/users', users.routes());
router.use('/pings', pings.routes());
router.use('', authentication.routes());

module.exports = router;