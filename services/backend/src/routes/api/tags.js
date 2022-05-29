const KoaRouter = require("koa-router");
const sequelize = require("sequelize");
const fetch = require("node-fetch");
const { jwtCheck, setCurrentUser } = require("./middlewares/session");

const router = new KoaRouter();
const Queue = require("bull");

router.get("api.tags.all", "/all", async (ctx) => {
  const tags = await ctx.orm.tag.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  ctx.body = tags;
});

router.use(jwtCheck);
router.use(setCurrentUser);

const indexQueue = new Queue("indexes queue", process.env.REDIS_URL); // Specify Redis connection using object
const CalculateIndexJob = (data) => {
  return indexQueue.add(data);
};

const calculateDindin = async (job) => {
  params = job.data;
  let data;
  console.log(process.env.INDEX_HOST);
  try {
    const response = await fetch(
      `${process.env.INDEX_HOST}/api/tags/${params.currentUserId}/${params.pingedUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    data = await response.json();
    console.log(data);
    done(null, data.index);
  } catch (error) {
    done(error);
  }
};

indexQueue.process(calculateDindin);

router.post("api.tags.send", "/:id", async (ctx) => {
  let currentUserId = ctx.state.currentUserId;
  let pingedUserId = parseInt(ctx.params.id);

  ctx.body = {
    dindin: await CalculateIndexJob({
      currentUserId: currentUserId,
      pingedUserId: pingedUserId,
    }),
  };
});

module.exports = router;
