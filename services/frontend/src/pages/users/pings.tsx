import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getApi, patchApi } from '~/lib/api';
import { useFormik } from 'formik';

import Head from 'next/head'


import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage';

function PingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true);
  const [pingsData, setPingsData] = useState(null);
  const [user] = useLocalStorage<User>('user');
  const [, setIdUserChat] = useLocalStorage<IdChat>('idChat');
  const [idPing, setIdPing] = useState(null);


  const respondingPing = (status_answer, id, cronTime) => {
    patchApi(user.token, `/api/pings/update/${id}`, {status: status_answer, cronTime: cronTime}) 
      .then(res => {
        setLoading(true);
      });
  }
  const formik = useFormik({
    initialValues: {
      day: '',
      hour: '',
      minute: '',
      status: '',
    },
    onSubmit: values => {
      const data = JSON.parse(values.status)
      const rialStatus = data.status
      const idPing = data.id

      if (values.day === '' || values.hour === '' || values.minute === '') {
        alert("Por favor, selecciona todos los campos para aprobar el ping");
        return 
      }
      
      // Formato {minuto_hora_diaMes_Mes_diaSemana}
      const cronString = `${values.minute} ${values.hour} * * ${values.day}`;
      console.log(cronString)
      // Aquí la consulta al back, se hace con patch que era como estaba antes.
      // passs ping id to respondingPing
      console.log("values", values)
      respondingPing(rialStatus, idPing, cronString);
    }
  });

  const weekData = [
    {name: 'Todos los dias', value: '1-6'},
    {name: 'Lunes', value: '1'},
    {name: 'Martes', value: '2'},
    {name: 'Miércoles',  value: '3'},
    {name: 'Jueves', value: '4'},
    {name: 'Viernes', value: '5'},
    {name: 'Sabado', value: '6'},    
  ];

  const weekOptions = weekData.map((data, index) => {
    return (
      <option value={data.value} key={index}>{data.name}</option>
    )
  })

  const hourOptions = Array.from(Array(24).keys()).map(data => {
    return (
      <option value={data} key={data}>{data}</option>
    )
  })

  const minutesOptions = Array.from(Array(60).keys()).map(data => {
    return (
      <option value={data} key={data}>{data}</option>
    )
  })


  const CronForm = (ping) => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.row} key={ping.id}>
          
          <select name="status" onChange={formik.handleChange} value={formik.values.status}>
          <option value="">Escoge una opción por favor</option>
            <option value={`{"status": -1, "id": ${ping.ping.id}}`}>Rechazar</option>
            <option value={`{"status": 1, "id": ${ping.ping.id}}`}>Aprobar</option>
          </select>
          <select name="day" id="cronDay" className={styles.selectDropdown} onChange={formik.handleChange} value={formik.values.day}>
            <option value="">Seleccionar día de la semana </option>
            {weekOptions}
          </select> 

          <select name="hour" id="cronHour" className={styles.selectDropdown} onChange={formik.handleChange} value={formik.values.hour}>
            <option value="">Seleccionar hora </option>
            {hourOptions}
          </select>

          <select name="minute" id="cronMinute" className={styles.selectDropdown} onChange={formik.handleChange} value={formik.values.minute}>
            <option value="">Seleccionar minuto </option>
            {minutesOptions} 
          </select>
          <button type="submit" className={styles.button}>Submit</button>
        </div>
      </form>
    )
  }




  if (user === undefined) {
    return (
      <div/>
    )
  }

  if (loading) {
    getApi(user.token, 'api/pings/all', null)
      .then(data => {
        console.log('%c Pings', 'color: orange')
        const jsonData = JSON.parse(data)
        console.table(jsonData.pingedUsers)
        console.table(jsonData.usersPingedBy)
        setPingsData(jsonData);

        setLoading(false);
      });

    return (
      <h2>Cargando</h2>
    )
  }

  const visitToProfile = (user) => {
    router.push({
      pathname: '/users/profile',
      query: { id: user.id },
    })
  }

  const visitFromProfile = (user) => {
    router.push({
      pathname: '/users/profile',
      query: { id: user.id },
    })
  }

  const goingToChat = (userEmail) => {
    setIdUserChat(userEmail)
    window.location.assign('/chat')
  }


  const pingsToUser = pingsData.usersPingedBy.map((ping) => {
    if (ping.status == 0) {
      return (
        <div className={styles.row} key={ping.id}>
          <p key={ping.id}><a className={styles.rowItemPress}
            onClick={() => visitToProfile(ping.pingedFrom)}>{ping.pingedFrom.firstname} {ping.pingedFrom.lastname}</a> te ha hecho un ping
          </p>
          <CronForm ping={ping}/>
        </div>

      )
    } else {
      return (
        <div className={styles.row} key={ping.id}>
          <p key={ping.id}>
            <a className={styles.rowItemPress}
              onClick={() => visitToProfile(ping.pingedFrom)}>{ping.pingedFrom.firstname} {ping.pingedFrom.lastname}
            </a> 
            te ha hecho un ping | {ping.status == 1 ? 'Aceptado' : 'Rechazado'}
            {ping.status === 1 ? 
            <a className={styles.button} href="/chat" onClick={() => goingToChat(ping.pingedFrom.email)}>
              Chatear con {ping.pingedFrom.firstname} {ping.pingedFrom.lastname}
            </a>
          : null}
          </p>
        </div>
      )
    }

  });

  const pingsFromUser = pingsData.pingedUsers.map((ping) => {
    return (
      <div key={ping.id}>
        <p> 
          <a className={styles.rowItemPress} />
            Has hecho un ping a <a className={styles.rowItemPress} onClick={() => visitFromProfile(ping.pingedTo)}>{ping.pingedTo.firstname} {ping.pingedTo.lastname}
          </a>
          
        </p>

        {ping.status === 1 ? 
          <a className={styles.button} href="/chat" onClick={() => goingToChat(ping.pingedTo.email)}>
            Chatear con {ping.pingedTo.firstname} {ping.pingedTo.lastname}
          </a>
        : null}
      </div>
    )
  });

  return (
    <div>
      <Head>
        <title>PingToc</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar logged={user.token !== null} />
      <div>
        <h2>Pings que te han hecho:</h2>
        <div className={styles.column}>
          {pingsToUser}
        </div>
        <div>
        </div>
        <h2>Pings que has hecho:</h2>
        <div className={styles.column}>
          {pingsFromUser}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PingsPage