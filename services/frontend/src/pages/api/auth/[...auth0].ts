import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: 'openid profile email'
        },
        returnTo: '/postLogin'
      });
    } catch (err) {
      console.log(err);
      res.status(err.status || 400).end(err.message);
    }
  }
});
