import React from 'react'
import styles from '../styles/Home.module.css'

const UserProfile = ({ data }) => {
  let noImage = false;
  
  if (!data.images) {
    noImage = true;
    data.images = [];
  }
  
  const userImages = data.images.map((image) => {
    return (
      <img key={image.id} className={styles.imgUser} src={image.imageUrl} alt={data.email} />
    )
  });
  
  return (
    <div className={styles.container}>
      <h3 className={styles.rowItem}>Datos del perfil</h3>

      <div className={styles.row}>
        <h4 className={styles.rowItem}>Email:</h4>
        <p className={styles.rowItemNB}>{data.email}</p>
      </div>

      <div className={styles.row}>
        <h4 className={styles.rowItem}>Nombre:</h4>
        <p className={styles.rowItemNB}>{data.firstname}</p>
      </div>

      <div className={styles.row}>
        <h4 className={styles.rowItem}>Apellido:</h4>
        <p className={styles.rowItemNB}>{data.lastname}</p>
      </div>

      <div className={styles.row}>
        <h4 className={styles.rowItem}>Teléfono:</h4>
        <p className={styles.rowItemNB}>{data.phone}</p>
      </div>

      { !noImage ? 
      <div> 
         <h3 className={styles.rowItem}>Imágenes del perfil</h3>
        <div>
          { data.images.length != 0 ? userImages 
          : <img className={styles.imgUser} src={'https://pbs.twimg.com/profile_images/1117986986508394496/bq8RcTlm_400x400.png'} alt={data.email} />   
          }             
        </div>
      </div>       
      : null }    
    </div>    
  )
}

export default UserProfile

