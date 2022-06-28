import React, { useState } from 'react';
import { useFormik } from 'formik';
import { postApi } from '../lib/api';

import styles from '../styles/Home.module.css'
 
const NewLocationForm = ({ token, setMarkers, tags }) => {
  const [tagsSelected, setTagsSelected] = useState([]);
  const [idSelected, setIdSelected] = useState([]);

  const Create = (values) => {
    if (idSelected.length == 0) {
      alert("Por favor, escoge al menos un tag");
    } else {
      values.tagsIds = idSelected;    
      postApi(token, 'api/markers/create', values)
        .then(res => {
          setMarkers(null);
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
      <p className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease" key={tag.id}>
        {tag.name}
      </p>    
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
      lng: '',
      tagsIds: [],
    },
    onSubmit: values => {
      if (!values.name || !values.lat || !values.lng) {
        alert("Por favor, ingresa valores válidos");
      } else {
        Create(values);
      }    
    },
  });

  return (
    <div className="flex flex-col gap-y-5 my-5 items-center">
      <h2 className="font-semibold text-xl">
        ¡Ingresa un lugar en el que estuviste y compártelo con los demás!
      </h2>

      <form className="flex flex-col gap-y-5 items-center my-5" onSubmit={formik.handleSubmit}>
        <div className="flex gap-x-5 justify-center">
          <div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Descripción"
              className="shadow-lg border-slate-100"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>

          <div className="text-center">
            <input
              id="lat"
              name="lat"
              type="text"
              placeholder="Latitud"
              className="shadow-lg border-slate-100"
              onChange={formik.handleChange}
              value={formik.values.lat}
            />
          </div>

          <div className="text-center">
            <input
              id="lng"
              name="lng"
              type="text"
              placeholder="Longitud"
              className="shadow-lg border-slate-100"
              onChange={formik.handleChange}
              value={formik.values.lng}
            /> 
          </div> 
        </div>

        <h3 className="text-lg">
          Añade tags a tu ubicación
        </h3>

        <div className="flex flex-wrap justify-center space-x-2">
          {selectedTags}
        </div>

        <div className="flex justify-center items-center m-0 w-full gap-x-5">
          <select
            name="tags"
            id="tags"
            className="text-center m-0 w-2/4 shadow-lg border-slate-100 "
            onChange={tag => selectedTag(tag.target.value)}
          >
            <option value="">Añadir tag</option>
            {tagsOptions}
          </select>

          <button className="bg-sky-600 hover:bg-sky-700 p-3 rounded-md text-slate-100 text-base" type="submit">
            Crear marcador
          </button>   

          <div 
            className="bg-gray-400 hover:bg-gray-500 p-3 rounded-md text-slate-100 text-base cursor-pointer"
            onClick={removeTags}
          >
            Eliminar tags
          </div>              
        </div>
      </form>
    </div>     
  );
};

export default NewLocationForm