import React, { useState } from 'react';

import { useFormik } from 'formik';
import { getApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const FormLocation = ({ setLoading, setInitialCoordinates }) => {
  const [temperature, setTemperature] = useState('16');
  
  const formik = useFormik({
    initialValues: {
      lat: '',
      lng: '',
    },
    onSubmit: values => {
      if (!values.lat || !values.lng) {
        alert("Por favor, ingresa valores válidos");
      } else {
        getApi('api/weather', values) 
          .then(data => {
            const jsonData = JSON.parse(data);
            setTemperature(jsonData["temp_c"]);
            setInitialCoordinates(values);
            setLoading(true);
          })
      }    
    },
  });

  return (
    <div className={styles.flexContainer}>
      <div className={styles.centerContainer}>
          <h2>La temperatura actual es: {temperature}°C</h2>
        </div>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.row}>
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
                id="lng"
                name="lng"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.lng}
              /> 
            </div> 
          </div> 
          <div className={styles.rowItem}>
            <button className={styles.button}type="submit">Encontrar temperatura</button>            
          </div>   
      </form>
    </div>     
  );
};

export default FormLocation