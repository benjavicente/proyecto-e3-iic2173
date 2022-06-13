const KoaRouter = require("koa-router");

const router = new KoaRouter({ prefix: "/api" });
const analytics = require("./analytics");

router.use("/analytics", analytics.routes());

module.exports = router;
