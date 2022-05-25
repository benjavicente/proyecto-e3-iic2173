import React, { useState } from 'react';
import { useRouter } from 'next/router'

import { useUser } from '@auth0/nextjs-auth0';

import styles from '../../styles/Home.module.css'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import UserProfile from '../../components/UserProfile'

import { getApi } from '../../lib/api';

export default function Profile() {
  const { query } = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { user } = useUser();

  if (loading) {
    getApi('api/users', {id: query.id}) 
      .then(data => {
        setData(data);
        setLoading(false);
      });

    return (
      <h2>Cargando</h2>
    )
  }

  return (
    <div>
      <Navbar logged={user !== undefined}/>
      <UserProfile data={data} />
      {user ? 
        <div>
          <h2>Está logueado</h2>
        </div>        
        : null}
        
      <Footer />
    </div>
  );
};
