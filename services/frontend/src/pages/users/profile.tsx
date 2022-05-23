import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import styles from '../../styles/Home.module.css'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

import useApi from '../../lib/use-api';

export default withPageAuthRequired(function Profile() {
  // useApi recibe la ruta del archivo a ejecutar
  const { response, error, isLoading } = useApi('/api/test');

  const { user } = useUser();

  if (isLoading) {
    return (
      <h2>Cargando</h2>
    )
  }

  if (error) {
    console.log(error);
    return (
      <div>Error</div>
    )    
  }

  console.log(user);
 
  return (
    <div>
      <Navbar logged={user !== undefined}/>
      {user ? 
        <div className={styles.container}>
          <h3 className={styles.rowItem}>Datos del perfil</h3>

          <div className={styles.row}>
            <h4 className={styles.rowItem}>Email:</h4>
            <p className={styles.rowItemNB}>{user.email}</p>
          </div>

          <div className={styles.row}>
            <h4 className={styles.rowItem}>Nombre:</h4>
            <p className={styles.rowItemNB}>{user['https://firstname']}</p>
          </div>

          <div className={styles.row}>
            <h4 className={styles.rowItem}>Apellido:</h4>
            <p className={styles.rowItemNB}>{user['https://lastname']}</p>
          </div>

          <div className={styles.row}>
            <h4 className={styles.rowItem}>Teléfono:</h4>
            <p className={styles.rowItemNB}>{user['https://phone']}</p>
          </div>

          <h3 className={styles.rowItem}>Imágenes del perfil</h3>
          <img src={user.picture} alt={user.name} />
        </div> :
        <h2>No hay usuario logueado</h2>
      }
      <Footer />
    </div>
  );
});
