import React from 'react';
import { useRouter } from 'next/router'
import { useAuth0 } from "@auth0/auth0-react"; 
import { postApi } from '../lib/api';

// Vista cuyo único propósito es redireccionar a index y hacer un post del user al back luego del login
export default function PostLogin() {
  const router = useRouter();

  // user necesario para extraer la metadata del user (datos obtenidos del register)
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0(); 

  const getToken = async () => {
    const accessToken = await getAccessTokenSilently();
    return await accessToken;
  }

  if (isLoading) {
    return (
      <div/>
    )
  }

  if (!isLoading) {
    if (!isAuthenticated) {
      // Se ingresó a la ruta sin haberse logueado
      router.push("/");
      return (
        <div />
      )
    }

    // username no puede contener espacios
    const body = {
      firstname: user['https://firstname'],
      lastname: user['https://lastname'],      
      phone: user['https://phone'],
      username: `${user['https://firstname']}${user['https://lastname']}`,
      email: user.email
    }    

    getToken().then(token => {
      localStorage.setItem('token', token);

      // Se envía la información del login/sigup a la API
      postApi(token, 'api/authenticate', body)
        .then(() => {
          router.push("/");
        });  
    })
  }
};
