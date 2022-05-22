const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api' });
const users = require('./users');

router.use('/users', users.routes());

module.exports = router;