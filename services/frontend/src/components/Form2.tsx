import React from 'react';
import { useFormik } from 'formik';

import styles from '../styles/Home.module.css'
 
const NewLocationForm = () => {
  const formik = useFormik({
    initialValues: {
      lat: '',
      long: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className={styles.flexContainer}>
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
              id="long"
              name="long"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.long}
            /> 
          </div> 
          
          <div className={styles.rowItem}>
            <button type="submit">Submit</button>
          </div>   
          </div>        
      </form>
    </div>     
  );
};
 
 export default NewLocationForm