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

  const respondingPing = (status_answer, id, cronTime) => {
    patchApi(user.token, `/api/pings/update/${id}`, {status: status_answer, cronTime: cronTime}) 
      .then(res => {
        setLoading(true);
      });
  }
  const formik = useFormik({
    initialValues: {
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
      let cronString;
      if (values.minute == 1 || values.minute == 0) {
        cronString = `* * * * *`;
      } else {
        cronString = `*/${values.minute} * * * *`;
      }
      respondingPing(rialStatus, idPing, cronString);
    }
  });

  const minutesOptions = Array.from(Array(60).keys()).map(data => {
    return (
      <option value={data} key={data}>{data}</option>
    )
  })

  const CronForm = (ping) => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-5 my-2" key={ping.id}>
          
          <select name="status" className="shadow-lg border-slate-50" onChange={formik.handleChange} value={formik.values.status}>
            <option value="">Escoge una opción, por favor</option>
            <option value={`{"status": -1, "id": ${ping.ping.id}}`}>
              Rechazar
            </option>
            <option value={`{"status": 1, "id": ${ping.ping.id}}`}>
              Aceptar
            </option>
          </select>

          <select name="minute" id="cronMinute" className="shadow-lg border-slate-50" onChange={formik.handleChange} value={formik.values.minute}>
            <option value="">Selecciona el tiempo renovación del LikeTracker (minutos) </option>
            {minutesOptions} 
          </select>
          <button 
            type="submit" 
            className="bg-sky-600 hover:bg-sky-700 py-1 px-3 rounded-md text-slate-100 text-base"
          >
            Guardar
          </button>
        </div>
      </form>
    )
  }

  const mapStatus = (status) => {
    switch (status) {
      case -1:
        return 'Rechazado'
      case 0:
        return 'Pendiente'
      case 1:
        return 'Aprobado'
      default:
        return 'Pendiente'
    }
  }

  if (user === undefined) {
    return (
      <div/>
    )
  }

  if (loading) {
    getApi(user.token, 'api/pings/all', null)
      .then(data => {
        const jsonData = JSON.parse(data)
        setPingsData(jsonData);
        setLoading(false);
      });

    return (
      <h2>Cargando</h2>
    )
  }

  const visitProfile = (user) => {
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
        <div className="rounder bg-slate-100 p-2 my-2" key={ping.id}>
          <p key={ping.id}>
            <a 
              className="font-semibold cursor text-sky-500 hover:text-sky-600 cursor-pointer"
              onClick={() => visitProfile(ping.pingedFrom)} > {`${ping.pingedFrom.firstname} ${ping.pingedFrom.lastname} `}
            </a> te ha hecho un ping
          </p>
          <CronForm ping={ping}/>
        </div>

      )
    } else {
      return (
        <div className="rounder bg-slate-100 p-2 my-2" key={ping.id}>
          <p key={ping.id}>
            <a 
            className="font-semibold cursor text-sky-500 hover:text-sky-600 cursor-pointer"
            onClick={() => visitProfile(ping.pingedFrom)} > {`${ping.pingedFrom.firstname} ${ping.pingedFrom.lastname} `}
            </a> 
            te ha hecho un ping | {ping.status == 1 ? 'Aceptado' : 'Rechazado'}

            {ping.status === 1 ? 
            <a 
              className="font-semibold cursor underline underline-offset-1 text-sky-500 hover:text-sky-600 cursor-pointer mx-5"
              href="/chat" 
              onClick={() => goingToChat(ping.pingedFrom.email)}
            >
              Ir al chat
            </a>
          : null}

        {(ping.analyticStatus == 1) ?
        <div>
          <table>
            <thead>
              <tr>
                <th className="text-center">SIDI</th>
                <th className="text-center">SIIN</th>
                <th className="text-center">DINDIN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">{ping.sidi ? ping.sidi : "-"}</td>
                <td className="text-center">{ping.siin ? ping.siin : "-"}</td>
                <td className="text-center">{ping.dindin ? ping.dindin : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        : null}
          </p>
        </div>
      )
    }

  });

  const pingsFromUser = pingsData.pingedUsers.map((ping) => {
    return (
      <div key={ping.id} className="rounder bg-slate-100 p-2 my-2">
        <p> 
          Has hecho un ping a
          <a className="font-semibold cursor text-sky-500 hover:text-sky-600 cursor-pointer" 
            onClick={() => visitProfile(ping.pingedTo)} > {`${ping.pingedTo.firstname} ${ping.pingedTo.lastname} `} 
          </a> 
        </p>

        <p>
          <span className="font-semibold">Estado:</span> { mapStatus(ping.status) }
        </p>
       {(ping.analyticStatus == 1) ?
        <div>
          <table>
            <thead>
              <tr>
                <th className="text-center">SIDI</th>
                <th className="text-center">SIIN</th>
                <th className="text-center">DINDIN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">{ping.sidi ? ping.sidi : "-"}</td>
                <td className="text-center">{ping.siin ? ping.siin : "-"}</td>
                <td className="text-center">{ping.dindin ? ping.dindin : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        : null}

        {ping.status === 1 ? 
          <a 
            className="font-semibold cursor underline underline-offset-1 text-sky-500 hover:text-sky-600 cursor-pointer mx-5" 
            href="/chat" onClick={() => goingToChat(ping.pingedTo.email)}
          >
            Ir al chat
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
      <div className="w-3/4 mx-auto rounded p-5 my-10 shadow-lg">

        <h2 className="font-semibold text-xl">Pings que te han hecho:</h2>
        <div className={styles.column}>
          {pingsToUser}
        </div>

        <h2 className="font-semibold text-xl">Pings que has hecho:</h2>
        <div className="">
          {pingsFromUser}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PingsPage