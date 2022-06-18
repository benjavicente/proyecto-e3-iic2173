const KoaRouter = require('koa-router');
const fetch = require('node-fetch');

const router = new KoaRouter();

router.get('api.weather', '/', async (ctx) => {
  const { lat = 33, lng = 33 } = ctx.request.query;

  const HOST = 'http://api.weatherunlocked.com'
  const { WEATHER_API_ID, WEATHER_API_KEY } = process.env;
  const OPTIONS = `app_id=${WEATHER_API_ID}&app_key=${WEATHER_API_KEY}&lang=es`;

  try {
    const data = await fetch(`${HOST}/api/current/${lat},${lng}?${OPTIONS}`);
    ctx.body = await data.json();
  } catch (error) {
    ctx.body = error;
    ctx.throw(400, error);
  }
});

module.exports = router;