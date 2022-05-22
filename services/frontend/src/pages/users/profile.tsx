import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

import styles from '../../styles/Home.module.css'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <h2>Cargando</h2>
    )
  }

  if (error) {
    return (
      <div>{error.message}</div>
    )    
  }

  return (
    <div className={styles.centerContainer}>
      <Navbar logged={user !== undefined}/>
      {user ? 
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div> :
        <h2>No hay usuario logueado</h2>
      }
      <Footer />
    </div>
  );
}