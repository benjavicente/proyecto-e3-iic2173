import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function users(req, res) {
  const { accessToken } = await getAccessToken(req, res);

  console.log("AT:", accessToken);
  
  try {
    const url = "/api/users";
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});