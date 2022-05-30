import React, { useState } from 'react';

import { useFormik } from 'formik';
import { getApi, postApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const LocationForm = ({ setLoading }) => {
  const [tagsSelected, setTagsSelected] = useState([]);
  const [idSelected, setIdSelected] = useState([]);
  const [coordinates, setCoordinates] = useState({lat: null, lng: null}); 

  const Create = (values) => {
    if (idSelected.length == 0) {
      alert("Por favor, escoge al menos un tag");
    } else {
      values.filteredTags = idSelected;    
      postApi('api/markers/create', values)
        .then(res => {
          setLoading(true);
        });
    }    
  }

  const removeTags = () => {
    setIdSelected([]);
    setTagsSelected([]);
  }
  
  const selectedTag = (tag) => {   
    const tagData = JSON.parse(tag);
    if (!idSelected.includes(tag.id)) {
      setTagsSelected([...tagsSelected, tagData]);
      setIdSelected([...idSelected, tagData.id]);        
    }    
  }
  
  const selectedTags = tagsSelected.map((tag) => {
    return (
      <p className={styles.rowItem} key={tag.id}>{tag.name}</p>    
    )
  });
  
  const tagsOptions = tags.map((tag) => {
    let exists = false;
    for (var i = 0; i < tagsSelected.length; i++) {
      if (tagsSelected[i].id == tag.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const value = `{"id":${tag.id},"name":"${tag.name}"}`;
      return (
        <option value={value} key={tag.id}>{tag.name}</option>
      )
    }    
  });

  const formik = useFormik({
    initialValues: {
      lat: '',
      lng: '',
    },
    onSubmit: values => {
      if (!values.lat || !values.lng) {
        alert("Por favor, ingresa valores válidos");
      } else {
        Create(values);
      }    
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
                id="lng"
                name="lng"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.lng}
              /> 
            </div> 
          </div> 
          <div className={styles.rowItem}>
            <button className={styles.button}type="submit">Crear marcador</button>            
            <a className={styles.button} onClick={removeTags}>Eliminar tags seleccionados</a>
          </div>   
      </form>
    </div>     
  );
};

export default LocationForm