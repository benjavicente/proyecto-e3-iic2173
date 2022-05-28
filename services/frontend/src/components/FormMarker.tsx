import React, { useState } from 'react';

import { useFormik } from 'formik';
import { postApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const NewLocationForm = () => {
  const [tagsSelected, setTagsSelected] = useState([]);
  const [idSelected, setIdSelected] = useState([]);

  const tags = [
    {
      id: 1,
      name: 'Deportes',      
    },
    {
      id: 2,
      name: 'Naturaleza',      
    },
    {
      id: 3,
      name: 'Comida',      
    },
    {
      id: 4,
      name: 'Música',      
    },
    {
      id: 5,
      name: 'Baile',      
    },
    {
      id: 6,
      name: 'Videojuegos',      
    },
    {
      id: 7,
      name: 'Arte',      
    },
    {
      id: 8,
      name: 'Política',      
    },
    {
      id: 9,
      name: 'Estudios',      
    },
    {
      id: 10,
      name: 'Animales',      
    },
  ];

  const Create = (values) => {
    if (idSelected.length == 0) {
      alert("Por favor, escoge al menos un tag");
    } else {
      values.filteredTags = idSelected;    
      console.log("Se crea", values);
      postApi('api/markers/new', values)
        .then(res => {
          console.log(res);
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
      name: '',
      lat: '',
      long: '',
      filteredTags: [],
    },
    onSubmit: values => {
      if (!values.name || !values.lat || !values.long) {
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
          <div className={styles.rowTags}>
            {selectedTags}
          </div>
          <div className={styles.flexContainer}>
            <select name="tags" id="tags" className={styles.selectDropdown} onChange={tag => selectedTag(tag.target.value)}>
              <option value="">Seleccionar tag</option>
              {tagsOptions}
            </select>                    
          </div>
          <div className={styles.rowItem}>
            <button className={styles.button}type="submit">Crear marcador</button>            
            <a className={styles.button} onClick={removeTags}>Eliminar tags seleccionados</a>
          </div>   
      </form>
    </div>     
  );
};

export default NewLocationForm