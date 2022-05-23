const jwt = require('koa-jwt');
const jwtDecode = require('jwt-decode');
const { koaJwtSecret } = require('jwks-rsa');


const jwtCheck = jwt({ 
  secret: koaJwtSecret({
    jwksUri: 'https://dev-7c2520d3.us.auth0.com/.well-known/jwks.json',
    cache: true,
    cacheMaxEntries: 5,
  }),
  audience: 'https://PingTocAuth.com',
  issuer: 'https://dev-7c2520d3.us.auth0.com/',
  algorithms: ['RS256']
});


const setCurrentUser = async (ctx, next) => {
  const token = await decodeToken(ctx.request.header);
  const userEmail = token['https://email'];

  let user = await getUserByEmail(ctx.orm, userEmail);

  if (user) {
    ctx.status = 200;
  } else {
    user = await registerNewUser(ctx, userEmail);
    ctx.status = 201;
  }
  ctx.state.currentUserId = user.id;
  return next();
};


const decodeToken = async (header) => {
  const { authorization } = header;
  const decodedJwt = jwtDecode(authorization);
  return decodedJwt;
}


const getUserByEmail = async (orm, email) => {
  const user = await orm.user.findOne({ where: { email: email } });;
  return user;
};


const registerNewUser = async (ctx, email) => {
  const user = ctx.orm.user.build(ctx.request.body);

  try {
    await user.save({
      fields: [
        'firstname',
        'lastname',
        'username',
        'email',
        'phone',
      ],
    });

    const newUser = await ctx.orm.user.findOne({ where: { email } });
    return newUser;
  } 
  catch (ValidationError) {
    console.log(ValidationError);
    return;
  }
}

module.exports = { jwtCheck, setCurrentUser };