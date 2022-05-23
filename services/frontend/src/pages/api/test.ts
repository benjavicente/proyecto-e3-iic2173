import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function test(req, res) {
  const { accessToken } = await getAccessToken(req, res);
  console.log("AT:", accessToken);
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const result = await response.json();
  res.status(200).json(result);
});