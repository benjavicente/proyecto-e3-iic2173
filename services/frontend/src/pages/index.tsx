import React, { useState, useEffect } from 'react';

import Head from 'next/head'
import styles from '~/styles/Home.module.css'

import dynamic from 'next/dynamic'
import { getApi } from '~/lib/api';

import Navbar from '~/components/Navbar'
import FormLocation from '~/components/FormLocation'
import Form from '~/components/FormMarker'
import useLocalStorage from '~/hooks/useLocalStorage';

function HomePage() {
  const [markers, setMarkers] = useState(null);
  const [users, setUsers] = useState(null);
  const [usersSelected, setUsersSelected] = useState([]);
  const [tags, setTags] = useState([]);
  const [temperature, setTemperature] = useState('0');
  const [idSelected, setIdSelected] = useState([]);
  const [filteredId, setFilteredId] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [initialCoordinates, setInitialCoordinates] = useState(null);

  const [user] = useLocalStorage<User>('user');

  if (user === undefined) {
    return (
      <div />
    )
  }

  if (markers === null) {
    console.log(user)
    if (user.token) {
      console.log('User', user)
      getApi(user.token, 'api/markers', { filteredIds: filteredId })
        .then(data => {
          console.log('Marker:', data)
          setMarkers(JSON.parse(data));
        })
    } else {
      // Se deja de esa forma para que userPositions.map no tire problemas
      setMarkers({ "userMarkers": [], "peopleMarkers": [] });
    }

    return (
      <div />
    )
  }

  if (users === null) {
    getApi(user.token, 'api/users/all', null)
      .then(data => {
        setUsers(JSON.parse(data));
      })

    return (
      <div />
    )
  }

  let coordinates = { lat: null, lng: null };

  navigator.geolocation.getCurrentPosition(function (position) {
    coordinates.lat = position.coords.latitude;
    coordinates.lng = position.coords.longitude;
  });

  if (weatherData === null) {
    getApi(user.token, 'api/weather', coordinates)
      .then(data => {
        console.log('Tiempo:', data)
        const jsonData = JSON.parse(data);
        setWeatherData(jsonData["temp_c"]);
      })
  }

  // Se cargan los tags
  if (tags.length == 0) {
    getApi(user.token, 'api/tags/all', null)
      .then(data => {
        console.log('Tags:', data)
        setTags(JSON.parse(data));
      })
  }

  const filter = () => {
    setFilteredId(idSelected);
    setMarkers(null);
  }

  const removeFilter = () => {
    setIdSelected([]);
    setUsersSelected([]);
    setFilteredId([]);
    setMarkers(null);
  }

  const selectedUser = (userSel) => {
    const userData = JSON.parse(userSel);
    if (idSelected.length < 5) {
      if (!idSelected.includes(userData.id)) {
        setUsersSelected([...usersSelected, userData]);
        setIdSelected([...idSelected, userData.id]);
      }
    }
  }

  const selectedUsers = usersSelected.map((userSel) => {
    return (
      <p className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease" key={userSel.id}>
        {userSel.name} {userSel.lastname}
      </p>
    )
  });

  const usersOptions = users.map((userOp) => {
    let exists = false;
    for (var i = 0; i < usersSelected.length; i++) {
      if (usersSelected[i].id == userOp.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const value = `{"id":${userOp.id},"name":"${userOp.firstname}","lastname":"${userOp.lastname}"}`;
      return (
        <option value={value} key={userOp.id}>{userOp.firstname} {userOp.lastname}</option>
      )
    }
  });

  const Map = dynamic(() => import('../components/Map'));

  return (
    <div className={styles.CenterContainer}>
      <Head>
        <title>PingToc</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-2/4 h-screen">
          {weatherData ?
            <div className={styles.centerContainer}>
              <h2 className="font-semibold text-2xl">
                La temperatura actual en la zona es: {weatherData}°C
              </h2>
            </div>
            : 
            <FormLocation
              token={user.token}
              setInitialCoordinates={setInitialCoordinates}
              temperature={temperature}
              setTemperature={setTemperature}
            />
          }
          
          <div className="flex justify-center">
            <img 
              alt=""
              src={'https://media.istockphoto.com/vectors/friends-vector-id1173780314?k=20&m=1173780314&s=612x612&w=0&h=m2ShqqBZkuQXSFDnHJA0gciFO8fWqG3Q9PqfphFQ0wI='}
              className="h-60 m-0"
             />
          </div>

          {user.token !== null ? <Form token={user.token} setMarkers={setMarkers} tags={tags} /> : null}
        </div>

        <div className="w-2/4 h-screen shadow-lg">
          <Map markers={markers} initialCoordinates={initialCoordinates} />
          {user.token ?
            <div className="flex flex-col gap-y-5 mt-5 items-center bottom-0 w-full rounded">
              <div className="flex flex-wrap justify-center space-x-2">
                {selectedUsers}
              </div>

              <div className="flex justify-center items-center m-0 w-full gap-x-5">
                <select 
                  name="users" 
                  id="users" 
                  className="shadow-lg w-2/5 border-slate-100" 
                  onChange={user => selectedUser(user.target.value)}
                >
                  <option value="">Filtrar por usuario</option>
                  {usersOptions}
                </select>

                <button 
                  className="bg-sky-600 hover:bg-sky-700 p-3 rounded-md text-slate-100 text-base"
                  onClick={filter}
                >
                  Aplicar filtro
                </button>

                <button 
                  className="bg-gray-400 hover:bg-gray-500 p-3 rounded-md text-slate-100 text-base cursor-pointer"
                  onClick={removeFilter}
                >
                  Eliminar filtros
                </button>
              </div>
            </div>
            : null  
          }
        </div>
      </div>

    </div>
  )
}

export default HomePage
