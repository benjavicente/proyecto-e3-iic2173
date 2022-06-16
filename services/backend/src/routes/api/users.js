const KoaRouter = require("koa-router");
const { jwtCheck, setCurrentUser } = require("./middlewares/session");
const { uploadFile } = require("./s3/fileUploader");

const router = new KoaRouter();

router.post("api.users.uploadImage","/upload/image", jwtCheck, setCurrentUser, async (ctx) => {
    const { currentUserId } = ctx.state;
    const uploadResults = await uploadFile(ctx);

    await Promise.all(
      uploadResults.map(async (result) => {
        const { Location } = result;

        const image = ctx.orm.image.build({
          userId: currentUserId,
          imageUrl: Location,
        });

        return await image.save({ fields: ["userId", "imageUrl"] });
      })
    );
    ctx.status = 201;
  }
);


router.get("api.users.currentUser", "/me",jwtCheck, setCurrentUser, async (ctx) => {
  const { currentUserId } = ctx.state;
  const user = await ctx.orm.user.findByPk(currentUserId, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: ctx.orm.image, attributes: ["id", "imageUrl"] }],
  });
  ctx.body = user;
}
);


router.get("api.users.all", "/all", async (ctx) => {
  const users = await ctx.orm.user.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: ctx.orm.image, attributes: ["id", "imageUrl"] }],
  });
  ctx.body = users;
});


router.get("api.users.profile", "/:id", async (ctx) => {
  const searchedUser = await ctx.orm.user.findByPk(ctx.params.id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: ctx.orm.image, attributes: ["id", "imageUrl"] }],
  });

  if (!searchedUser) {
    ctx.throw(404, "El usuario indicado no existe");
  }

  ctx.body = searchedUser;
});

router.get("api.users.paginated", "/", async (ctx) => {
  const { page = 1, page_size: pageSize = 6 } = ctx.request.query;

  const users = await ctx.orm.user.findAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: ctx.orm.image, attributes: ["id", "imageUrl"] }],
  });
  ctx.body = users;
});

module.exports = router;
