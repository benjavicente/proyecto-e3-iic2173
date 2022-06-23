import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getApi, postApi } from '~/lib/api';

import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import UserProfile from '~/components/UserProfile'

import { uploadApi } from '~/lib/api';

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage';

export default function Profile() {
  const router = useRouter()
  const { query } = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [pingMessage, setPingMessage] = useState('');
  const [file, setFile] = useState(null);
  const [token] = useLocalStorage<string>('token');


  if (query.reload == 'true') {
    query.reload = 'false';
    setError(false);
    setLoading(true);
  }

  if (token === undefined) {
    return (
      <div />
    )
  }

  // Caso cuando se intenta acceder al perfil sin haber iniciado sesión
  if (query.id === 'me' && token === null) {
    router.push({
      pathname: '/',
    })
    return (
      <div />
    )
  }

  if (loading) {
    getApi(token, 'api/users', { id: query.id })
      .then(info => {
        console.log(info)
        try {
          setData(JSON.parse(info));
          setLoading(false);
        }
        catch (err) {
          setError(true);
          setLoading(false);
        }
      })
    return (
      <h2>Cargando</h2>
    )
  }

  const makePing = () => {
    const body = {
      pingedUserId: data.id
    }
    postApi(token, '/api/pings/create', body)
      .then(res => {
        if (res == 'Created') {
          setPingMessage('Ping hecho con éxito');
        } else if (res == 'Lo sentimos, pero no puedes enviarte un ping a ti mismo') {
          setPingMessage('No puedes hacerte ping contigo mismo');
        }
        else {
          setPingMessage('Ya has hecho ping con este usario');
        }
      });
  }

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };

  const uploadImage = () => {
    if (file == undefined) {
      alert("Por favor, escoge una imagen");
    } else {
      const formData = new FormData();

      formData.append(
        "userImages",
        file,
      );

      uploadApi(token, '/api/users/upload/image', formData)
        .then(res => {
          // Luego de la request se debe eliminar la imagen
          setFile(null);
          setLoading(true);
        });
    }
  }

  return (
    <div>
      <Navbar logged={token !== null} />
      {error ?
        <div className={styles.centerContainer}>
          <h2>No sé encontró al usuario</h2>
        </div> :
        <UserProfile data={data} />
      }

      {token !== null && query.id !== 'me' && !error ?
        <div>
          <div className={styles.row}>
            <button className={styles.button} onClick={makePing}>Hacer Ping</button>
            <p className={styles.rowItem}>{pingMessage}</p>
          </div>
        </div>
        : null}
      {token !== null && query.id === 'me' ?
        <div>
          <h3 className={styles.rowItem}>¿Deseas subir imágenes de perfil?</h3>
          <div>
            <input className={styles.button} type="file" onChange={onFileChange} />
            <button className={styles.button} onClick={uploadImage}>
              Subir imagen
            </button>
          </div>
        </div>
        : null}

      <Footer />
    </div>
  );
};
