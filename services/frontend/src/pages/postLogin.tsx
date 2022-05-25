import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0';

import { postApi } from '../lib/api';

// Vista cuyo único propósito es redireccionar a index y hacer un post del user al back luego del login
export default function PostLogin() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (!isLoading) {
    if (user == undefined) {
      // Si se ingreso a la ruta sin haberse logueado
      router.push("/");
    }
    const body = {
      firstname: user['https://firstname'],
      lastname: user['https://lastname'],      
      phone: user['https://phone'],
      email: user.email
    }    
    postApi('api/login', body)
      .then(res => {
        router.push("/");
      });
  }
};
