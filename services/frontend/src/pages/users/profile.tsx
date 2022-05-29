import React, { useState } from 'react';

import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';

import { getApi, postApi } from '../../lib/api';

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import UserProfile from '../../components/UserProfile'

import { uploadApi } from '../../lib/api';

import styles from '../../styles/Home.module.css'

export default function Profile() {
  const router = useRouter()
  const { query } = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [pingMessage, setPingMessage] = useState('');
  const [file, setFile] = useState(null);
  const { user, isLoading } = useUser();
  
 
  if (query.reload == 'true') {    
    query.reload = 'false';
    setLoading(true);
  }

  if (isLoading) {
    return (
      <h2>Cargando</h2>
    )
  }  

  if (user == undefined && query.id == 'me') {
    router.push({
      pathname: '/api/auth/login',
    })
    return (
      <div />
    )
  }

  if (loading) {
    getApi('api/users', {id: query.id}) 
      .then(info => {
        if (info == '') {
          setError(true);
          setLoading(false);
        } else {
          setData(JSON.parse(info));
          setLoading(false);
        }
      });

    return (
      <h2>Cargando</h2>
    )
  }  

  const makePing = () => {
    const body = {
      pingedUserId: data.id
    }    
    postApi('api/pings', body)
      .then(res => {
        if (res == 'Validation error') {
          setPingMessage('Ya has hecho ping con este usario');
        } else {
          setPingMessage('Ping hecho con éxito');
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

      uploadApi('api/users/upload/image', formData)
        .then(res => {
          console.log(res);
          // Luego de la request se debe eliminar la imagen
          setFile(null);
        });
    }  
  }

  return (
    <div>
      <Navbar logged={user !== undefined }/>
      { error ? 
        <div className={styles.centerContainer}>
            <h2>No sé encontró al usuario</h2>
        </div> : 
        <UserProfile data={data} />
      }
      
      { user && query.id != 'me' ? 
        <div>
          <div className={styles.row}> 
            <button className={styles.button} onClick={makePing}>Hacer Ping</button>
            <p className={styles.rowItem}>{pingMessage}</p> 
          </div>
        </div>                    
      : null }  
      { user && query.id == 'me' ? 
        <div> 
          <h3 className={styles.rowItem}>¿Deseas subir imágenes de perfil?</h3>
        <div>        
          <input className={styles.button} type="file" onChange={onFileChange} />
          <button className={styles.button} onClick={uploadImage}> 
            Subir imagen 
          </button> 
        </div>
      </div>
      : null }    
        
      <Footer />
    </div>
  );
};
