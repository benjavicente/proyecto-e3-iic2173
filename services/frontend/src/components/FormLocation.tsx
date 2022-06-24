import React, { useState } from 'react';

import { useFormik } from 'formik';
import { getApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const FormLocation = ({ token, setInitialCoordinates, temperature, setTemperature }) => {  
  const formik = useFormik({
    initialValues: {
      lat: '',
      lng: '',
    },
    onSubmit: values => {
      if (!values.lat || !values.lng) {
        alert("Por favor, ingresa valores válidos");
      } else {
        getApi(token, 'api/weather', values) 
          .then(data => {
            const jsonData = JSON.parse(data);
            setTemperature(jsonData["temp_c"]);
            setInitialCoordinates(values);
          })
      }    
    },
  });

  return (
    <div className="flex flex-col gap-y-5 my-5">
      <div className="flex justify-center">
        <h2 className="font-semibold text-2xl">
          La temperatura actual en la zona es: {temperature}°C
        </h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex gap-x-5 justify-center">
        <input
          id="lat"
          name="lat"
          type="text"
          placeholder="Latitud"
          className="shadow-lg border-slate-100"
          onChange={formik.handleChange}
          value={formik.values.lat}
        />

        <input
          id="lng"
          name="lng"
          type="text"
          placeholder="Longitud"
          className="shadow-lg border-slate-100"
          onChange={formik.handleChange}
          value={formik.values.lng}
        />
        
        <div>
          <button className="bg-sky-600 hover:bg-sky-700 p-3 rounded-md text-slate-100 text-base" type="submit">
            Obtener temperatura
          </button>            
        </div>   
      </form>
    </div>     
  );
};

export default FormLocation