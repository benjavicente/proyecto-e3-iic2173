const KoaRouter = require("koa-router");
const sequelize = require("sequelize");
const fetch = require("node-fetch");
const { jwtCheck, setCurrentUser } = require("./middlewares/session");

const router = new KoaRouter();

router.get("api.tags.all", "/all", async (ctx) => {
  const tags = await ctx.orm.tag.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  ctx.body = tags;
});

router.use(jwtCheck);
router.use(setCurrentUser);

router.post("api.tags.send", "/:id", async (ctx) => {
  const currentUserId = ctx.state.currentUserId;
  const pingedUserId = parseInt(ctx.params.id);
  try {
    const response = await fetch(
      `${process.env.INDEX_HOST}/api/tags/${currentUserId}/${pingedUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    ctx.body = await response.json();
  } catch (error) {
    ctx.body = error;
    ctx.throw(400, error);
  }
  console.log(ctx.body);
  console.log("ctx.body");
});

module.exports = router;
