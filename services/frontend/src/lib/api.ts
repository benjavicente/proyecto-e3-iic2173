export async function getApi(token, url, params) {
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

  console.log(url + urlParams, token);
  const response = await fetch(url + urlParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    },
   });

  return await response.text();
}

export async function postApi(token, url, body) {
  console.log("|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-TOKEN-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|");
  console.log(token);
  console.log("|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-TOKEN-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|");
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(body)
   });

  return await response.text();
}

export async function patchApi(token, url, body) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(body)
   });

  return await response.text();
}

export async function uploadApi(token, url, file) {  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}` 
    },
    body: file
   });

  return await response.text();
}