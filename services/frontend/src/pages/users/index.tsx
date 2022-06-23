import React, { useState } from 'react'

import Head from 'next/head'

import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import UserInfo from '~/components/UserInfo'

import { getApi } from '~/lib/api'

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage'

function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState(null);
  const [page, setPage] = useState(1);
  const [token] = useLocalStorage<string>("token");

  console.log('Token', token)

  if (token === undefined) {
    return (
      <div />
    )
  }

  if (loading) {
    getApi(token, 'api/users', { 'page': page })
      .then(data => {
        setUsersData(JSON.parse(data));
        setLoading(false);
      });

    return (
      <h2>Cargando</h2>
    )
  }

  const prevPage = () => {
    setPage(page - 1);
    setLoading(true);
  }
  const nextPage = () => {
    setPage(page + 1);
    setLoading(true);
  }

  const Users = usersData.map((user) => {
    return (
      <UserInfo user={user} key={user.id} />
    )
  });

  return (
    <div>
      <Head>
        <title>PingToc</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar logged={token !== null} />

      <div className={styles.centerContainer}>
        <h1> Lista de usuarios </h1>
        <p> Página {page} </p>
        <button className={styles.button} onClick={prevPage} disabled={page == 1}>Página anterior</button>
        <button className={styles.button} onClick={nextPage} disabled={usersData.length == 0}>Siguiente página</button>
      </div>

      <div className={styles.flexWrapContainer}>
        {usersData.length !== 0 ? Users : <h2> No hay más usuarios</h2>}
      </div>

      {usersData.length !== 0 ?
        <div className={styles.centerContainer}>
          <button className={styles.button} onClick={prevPage} disabled={page == 1}>Página anterior</button>
          <button className={styles.button} onClick={nextPage} disabled={usersData.length == 0}>Siguiente página</button>
        </div>
        : null}

      <Footer />
    </div>
  )
}

export default UsersPage
