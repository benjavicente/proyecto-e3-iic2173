const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const authentication = require('./authentication');
const users = require('./users');
const pings = require('./pings')
const markers = require('./markers');
const weather = require('./weather');
const tags = require('./tags');

router.use('/users', users.routes());
router.use('/pings', pings.routes());
router.use('/markers', markers.routes());
router.use('/weather', weather.routes());
router.use('/tags', tags.routes());
router.use('', authentication.routes());

module.exports = router;