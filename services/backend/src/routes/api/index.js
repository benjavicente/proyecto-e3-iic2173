const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const authentication = require('./authentication');
const users = require('./users');
const pings = require('./pings')
const markers = require('./markers');

router.use('/users', users.routes());
router.use('/pings', pings.routes());
router.use('/markers', markers.routes());
router.use('', authentication.routes());

module.exports = router;