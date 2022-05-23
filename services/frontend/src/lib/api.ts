// Based on https://github.com/auth0/nextjs-auth0/tree/main/examples/kitchen-sink-example
export async function getApi(url){
  console.log("URL:", url);
  const response = await fetch(url);
  return await response;
}

export async function postApi(url, body){
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  return await response;
}