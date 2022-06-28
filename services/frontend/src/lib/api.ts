import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string, token?: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);

export const useFetch = <Data>(url: string, token?: string) => useSWR<Data>([url, token], fetcher);

export async function getApi(token, path, params) {
  if (typeof window === undefined){
    return {message: 'server'} 
  }
  let url = new URL(`${window.location.origin}/${path}`);

  if (params) {
    if (params.id) {
      // Caso de profile es distinto a como maneja los parámetros la API
      url = new URL(`${window.location.origin}/${path}/${params.id}`);
    } else {
      Object.keys(params).forEach((key) => {
        if (key === "lat" || key == "lng") {
          // Hay que entregarlos como float, no como string
          url.searchParams.append(key, params[key]);
        } else {
          url.searchParams.append(key, JSON.stringify(params[key]));
        }
      });
    }
  }

  console.log("URL:", url.href);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return await response.text();
}

export async function postApi(token, url, body) {
  console.log(body);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await response.text();
}

export async function patchApi(token, url, body) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await response.text();
}

export async function uploadApi(token, url, file) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: file,
  });

  return await response.text();
}
