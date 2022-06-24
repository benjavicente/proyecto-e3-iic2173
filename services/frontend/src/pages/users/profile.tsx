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
          <div className="flex flex-col items-center justify-center gap-x-10 my-10">
            <button
              className="bg-sky-600 hover:bg-sky-700 py-3 px-5 rounded-md text-slate-100 text-base"
              onClick={makePing}
            >
              Enviar Ping
            </button>
            <p className="m-0">{pingMessage}</p>
          </div>
        </div>
        : null}
      {token !== null && query.id === 'me' ?
        <div className="flex flex-col gap-5 items-center justify-center my-10">
          <h3 className="">Sube imágenes a tu perfil</h3>

          <div className="flex justify-center gap-5">
            <div className="mb-3 w-96">
              <input 
                className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                type="file"
                onChange={onFileChange}
              />
            </div>

            <button
              className="bg-sky-600 hover:bg-sky-700 p-3 rounded-md text-slate-100 text-base"
              onClick={uploadImage}
            >
              Subir imagen
            </button>
          </div>
        </div>
        : null}

                  {/* <div>
            <input className={styles.button} type="file" onChange={onFileChange} />
            <button className={styles.button} onClick={uploadImage}>
              Subir imagen
            </button>
          </div> */}

      <Footer />
    </div>
  );
};
