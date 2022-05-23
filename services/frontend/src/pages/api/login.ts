import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function login(req, res) {
  const { accessToken } = await getAccessToken(req, res);

  console.log("AT:", accessToken);
  
  try {
    const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: req.body
  });
  const result = await response.json();
  console.log(result);
  res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});