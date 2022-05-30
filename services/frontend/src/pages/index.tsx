import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

import dynamic from 'next/dynamic'
import { getApi } from '../lib/api';

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FormLocation from '../components/FormLocation'

import Form from '../components/FormMarker'

function HomePage() {
  const [markers, setMarkers] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [usersSelected, setUsersSelected] = useState([]);
  const [idSelected, setIdSelected] = useState([]);
  const [filteredId, setFilteredId] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [initialCoordinates, setInitialCoordinates] = useState(null);

  const { user, isLoading } = useUser();  

  if (isLoading) {
    return (
      <div />
    )
  }

  if (loading) {
    if (user != undefined) {
      getApi('api/markers', {filteredIds: filteredId}) 
      .then(data => {
        setMarkers(JSON.parse(data));
        setLoading(false);
      })
    } else {
      // Se deja de esa forma para que userPositions.map no tire problemas
      setMarkers({"userMarkers": [], "peopleMarkers": []});    
      setLoading(false);
    }   
    
    return (
      <div />
    )
  }

  if (userLoading) {
    getApi('api/users/all', null) 
    .then(data => {
      setUsers(JSON.parse(data));
      setUserLoading(false);
    })

    return (
      <div />
    )
  }

  let coordinates = {lat: null, lng: null};

  navigator.geolocation.getCurrentPosition(function(position) {
    coordinates.lat = position.coords.latitude;
    coordinates.lng = position.coords.longitude;
    });

  getApi('api/weather', coordinates) 
    .then(data => {
      const jsonData = JSON.parse(data);
      setWeatherData(jsonData["temp_c"]);
    })

  const filter = () => {
    setFilteredId(idSelected);
    setLoading(true);
  }

  const removeFilter = () => {
    setIdSelected([]);
    setUsersSelected([]);
    setFilteredId([]);
    setLoading(true);
  }

  const selectedUser = (user) => {   
    const userData = JSON.parse(user);
    if (idSelected.length < 5) {
      if (!idSelected.includes(userData.id)) {
        setUsersSelected([...usersSelected, userData]);
        setIdSelected([...idSelected, userData.id]);        
      }   
    }     
  }
  
  const selectedUsers = usersSelected.map((user) => {
    return (
      <p className={styles.rowItem} key={user.id}>{user.name} {user.lastname}</p>    
    )
  });
  
  const usersOptions = users.map((user) => {
    let exists = false;
    for (var i = 0; i < usersSelected.length; i++) {
      if (usersSelected[i].id == user.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const value = `{"id":${user.id},"name":"${user.firstname}","lastname":"${user.lastname}"}`;
      return (
        <option value={value} key={user.id}>{user.firstname} {user.lastname}</option>
      )
    }    
  });

  const Map = dynamic(() => import('../components/Map'))
  
  return (
    <div className={styles.CenterContainer}>
      <Head>
        <title>PingToc</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar logged={user !== undefined}/>
      { weatherData ? 
        <div className={styles.centerContainer}>
          <h2>La temperatura actual es: {weatherData}°C</h2>
        </div>
      : <FormLocation setLoading={setLoading} setInitialCoordinates={setInitialCoordinates} /> }
      
      { user ? 
        <div>
          <h3 className={styles.centerContainer}>Usuarios seleccionados:</h3>
          <div className={styles.rowUsers}>
            {selectedUsers}
          </div>
      
          <div className={styles.flexContainer}>
            <select name="users" id="users" className={styles.selectDropdown} onChange={user => selectedUser(user.target.value)}>
              <option value="">Seleccionar usuario</option>
              {usersOptions}
            </select>

            <button className={styles.button} onClick={filter}>Filtrar</button>
            <button className={styles.button} onClick={removeFilter}>Eliminar filtros</button>
          </div>
        </div>        
      : null }      

      <Map markers={ markers } initialCoordinates={initialCoordinates} />
      { user ? <Form setLoading={setLoading}/> : null }
           
      <Footer />
    </div>
  )
}

export default HomePage
