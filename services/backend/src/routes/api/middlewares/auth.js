var jwt = require('koa-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-7c2520d3.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://PingTocAuth.com',
    issuer: 'https://dev-7c2520d3.us.auth0.com/',
    algorithms: ['RS256']
});

module.exports = { jwtCheck };