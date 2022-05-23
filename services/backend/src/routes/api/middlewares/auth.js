const jwt = require('koa-jwt');
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

module.exports = { jwtCheck };