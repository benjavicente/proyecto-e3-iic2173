import { useState } from 'react';

import { useRouter } from 'next/router'
import { useAuth0 } from "@auth0/auth0-react";

import { postApi } from '../lib/api';

// Vista cuyo único propósito es redireccionar a index y hacer un post del user al back luego del login
export default function PostLogin() {
  const router = useRouter();

  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0(); 

  const getToken = async () => {
    const accessToken = await getAccessTokenSilently();
    console.log(await accessToken);
    return await accessToken;
  }

  if (!isLoading) {
    if (!isAuthenticated) {
      // Si se ingreso a la ruta sin haberse logueado
      router.push("/");
    }

    const body = {
      firstname: user['https://firstname'],
      lastname: user['https://lastname'],      
      phone: user['https://phone'],
      username: `${user['https://firstname']}${user['https://lastname']}`,
      email: user.email
    }    

    getToken().then(token => {
      postApi(token, 'api/authenticate', body)
      .then(res => {
        router.push("/");
      });
    })    
  }
};
