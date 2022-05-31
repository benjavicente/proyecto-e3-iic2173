const KoaRouter = require("koa-router");

const router = new KoaRouter({ prefix: "/api" });
const pings = require("./pings");

router.use("/pings", pings.routes());

module.exports = router;
