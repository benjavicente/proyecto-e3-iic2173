import { useAuth0 } from '@auth0/auth0-react';

export async function getApi(url, params) {
  const { getAccessTokenSilently, isAuthenticated, } = useAuth0();

  console.log("AHHHH");
  let token = ""
  if (isAuthenticated) {
    token = await getAccessTokenSilently({
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE,
    });
  }

  console.log("Token:", await token);

  // const token =  (await accessToken.text()).slice(1,-1);

  // Colocar en el .env
  const baseUrl = "";

  let urlParams = "";

  if (params) {
    if (params.id) {
      urlParams += "/" + params.id;
    }
    else {
      urlParams += "?";
      for (const [key, value] of Object.entries(params)) {
        if (key == 'lat' || key == 'lng') {
          urlParams += `${key}=${value}`;
        urlParams += '&';
        } else {
          urlParams += `${key}=${JSON.stringify(value)}`;
          urlParams += '&';
        }        
      }
    }  
  }  

  console.log(baseUrl + url + urlParams, token);
  const response = await fetch(baseUrl + url + urlParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    },
   });

  return await response.text();
}

export async function postApi(url, body){
  const accessToken = await fetch('/api/getToken');
  const token = await (await accessToken.text()).slice(1,-1);

  console.log("|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-TOKEN-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|");
  console.log(token);
  console.log("|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-TOKEN-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|");

  // Colocar en el .env
  const baseUrl = "";
  
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

export async function patchApi(url, body){
  const accessToken = await fetch('/api/getToken');
  const token = await (await accessToken.text()).slice(1,-1);

  // Colocar en el .env
  const baseUrl = "";
  
  const response = await fetch(baseUrl + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(body)
   });

  return await response.text();
}

export async function uploadApi(url, file){
  const accessToken = await fetch('/api/getToken');
  const token = await (await accessToken.text()).slice(1,-1);

  // Colocar en el .env
  const baseUrl = "";
  
  const response = await fetch(baseUrl + url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}` 
    },
    body: file
   });

  return await response.text();
}