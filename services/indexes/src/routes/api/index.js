const KoaRouter = require("koa-router");

const router = new KoaRouter({ prefix: "/api" });
const pings = require("./pings");
const tags = require("./tags");

router.use("/pings", pings.routes());
router.use("/tags", tags.routes());

module.exports = router;
