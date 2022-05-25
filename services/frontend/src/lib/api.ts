// Based on https://github.com/auth0/nextjs-auth0/tree/main/examples/kitchen-sink-example
export async function getApi(url, params){
  // url de fetch hay que hacerla desde el root de pages
  const accessToken = await fetch('../api/getToken');
  const token = await (await accessToken.text()).slice(1,-1);

  // Colocar en el .env
  const baseUrl = "http://localhost:8000/"

  let urlParams = "";

  if (params) {
    if (params.id) {
      urlParams += "/" + params.id;
    }
    else {
      urlParams += "?";
      for (const [key, value] of Object.entries(params)) {
        urlParams += `${key}=${JSON.stringify(value)}`
      }
    }  
  }  

  const response = await fetch(baseUrl + url + urlParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    },
   });

  return await await response.text();
}

export async function postApi(url, body){
  const accessToken = await fetch('api/getToken');
  const token = await (await accessToken.text()).slice(1,-1);

  // Colocar en el .env
  const baseUrl = "http://localhost:8000/";
  
  const response = await fetch(baseUrl + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(body)
   });

  return await response.text();
}