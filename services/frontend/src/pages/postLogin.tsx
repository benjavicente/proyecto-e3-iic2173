import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { useAuth0 } from "@auth0/auth0-react";
import useLocalStorage from '~/hooks/useLocalStorage';
import axios from 'axios';

// Vista cuyo único propósito es redireccionar a index y hacer un post del user al back luego del login
export default function PostLogin() {
  const router = useRouter();
  const [, setUserLogged] = useLocalStorage<User>("user")

  // user necesario para extraer la metadata del user (datos obtenidos del register)
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading && !isAuthenticated) return
    getAccessTokenSilently().then(token => {
      
      // Se envía la información del login/sigup a la API
      // username no puede contener espacios
      const body = {
        firstname: user['https://firstname'],
        lastname: user['https://lastname'],
        phone: user['https://phone'],
        username: `${user['https://firstname']}${user['https://lastname']}`,
        email: user.email
      }
      axios.post("api/authenticate", body, { headers: { Authorization: `Bearer ${token}` } }).then(() => {
        router.push('/');
      })

      setUserLogged({email: user.email, token})
      // setToken(token)
      // setEmail(user.email);
    })

  }, [isLoading, isAuthenticated])

  if (isLoading) return null

  if (!isLoading && !isAuthenticated) {
    // Se ingresó a la ruta sin haberse logueado
    router.push("/");
    return null
  }

  return null
};
