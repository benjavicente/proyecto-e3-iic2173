import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

import dynamic from 'next/dynamic'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import Form from '../components/Form2'

/*
Botón que sirve como link a otra página
<div className={styles.CenterContainer}>
  <form action="new_location">
    <input type="submit" value="Nueva ubicación"/>
  </form>
</div>
*/

function HomePage() {
  const { user } = useUser();  

  const Map = dynamic(
    () => import('../components/map'), 
    { 
      loading: () => 
      <h1 className={styles.title}>
        El mapa está cargando...
      </h1>,
      ssr: false // This line is important. It's what prevents server-side render
    }
  )

  return (
    <div className={styles.CenterContainer}>
      <Head>
        <title>PingToc</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar logged={user !== undefined}/>
      <Map />
      <Form />      
      <Footer />
    </div>
  )
}

export default HomePage
