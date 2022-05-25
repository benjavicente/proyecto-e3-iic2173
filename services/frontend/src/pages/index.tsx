import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

import dynamic from 'next/dynamic'
import { getApi } from '../lib/api';

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// import Map from '../components/Map'

import Form from '../components/FormMarker'

function HomePage() {
  const [markers, setMarkers] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [usersSelected, setUsersSelected] = useState([]);
  const 
  const { user } = useUser();  

  if (loading) {
    getApi('api/markers', {filteredIds: []}) 
      .then(data => {
        setMarkers(JSON.parse(data));
        setLoading(false);
      })
    
    return (
      <div>
      </div>
    )
  }

  if (userLoading) {
    getApi('api/users', {'page_size': 1000}) 
      .then(data => {
        setUsers(JSON.parse(data));
        setUserLoading(false);
      })
    
    return (
      <div>
      </div>
    )
  }

  const filter = () => {

  }

  let selected = [];

  const selectedUser = (user) => {
    if (usersSelected.length < 5) {
      if (!usersSelected.includes(user)) {
        selected.push(user);
        setUsersSelected([...usersSelected, user]);
      }   
    }     
  }
  
  const selectedUsers = usersSelected.map((user) => {
    const userData = JSON.parse(user);
    return (
      <p className={styles.rowItem}>{userData[1]} {userData[2]}</p>    
    )
  });
  
  console.log("S", usersSelected);
  const usersOptions = users.map((user) => {
    let exists = false;
    for (var i = 0; i < usersSelected.length; i++) {
      const jsonSelected = JSON.parse(usersSelected[i]);
      if (jsonSelected[0] == user.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const value = `[${user.id}, "${user.firstname}", "${user.lastname}"]`;
      return (
        <option value={value}>{user.firstname} {user.lastname}</option>
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
      <div>
        {selectedUsers}
      </div>
      
      <div className={styles.flexContainer}>
        <select name="users" id="users" onChange={user => selectedUser(user.target.value)}>
          {usersOptions}
        </select>
      </div>

      <Map markers={markers} />
      <Form />      
      <Footer />
    </div>
  )
}

export default HomePage
