import React from 'react';
import { useFormik } from 'formik';

import { postApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const NewLocationForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      lat: '',
      long: '',
    },
    onSubmit: values => {
      postApi('api/markers/new', values);
    },
  });
  return (
    <div className={styles.flexContainer}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.row}>
        <div className={styles.rowItem}>
            <label htmlFor="firstName">Nombre: </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div className={styles.rowItem}>
            <label htmlFor="firstName">Latitud: </label>
            <input
              id="lat"
              name="lat"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.lat}
            />
          </div>
          <div className={styles.rowItem}>
            <label htmlFor="lastName">Longitud: </label>
            <input
              id="long"
              name="long"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.long}
            /> 
          </div> 
          </div> 
          <div className={styles.rowItem}>
            <button className={styles.button}type="submit">Crear marcador</button>
          </div>   
      </form>
    </div>     
  );
};
 
 export default NewLocationForm