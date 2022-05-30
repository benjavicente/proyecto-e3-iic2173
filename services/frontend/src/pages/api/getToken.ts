import { getAccessToken } from '@auth0/nextjs-auth0';

export default async function getToken(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    
    // Quitar al deployar
    console.log(await accessToken);
    res.status(200).json(accessToken);
  } catch(err) {
    // No hay usuario logueado
    res.status(200).json("");
  }  
};