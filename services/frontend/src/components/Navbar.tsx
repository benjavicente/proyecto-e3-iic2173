import { useRouter } from 'next/router'

import { useAuth0 } from '@auth0/auth0-react';

import styles from '../styles/Home.module.css'

const Navbar = ({ logged }) => {
  // Logged es un parámetro booleano que indica si existe un 
  // usuario loggeado, este parámetro se le envía desde la vista a la 
  // que se llama este componente
  const router = useRouter()

  const { loginWithRedirect, logout } = useAuth0();

  function handleLogin() {
    loginWithRedirect();
  }
  
  const press = () => {    
    router.push({
      pathname: '/users/profile',
      query: { id: 'me', reload: 'true' },
    })
  }

  

  return (
    <header>
      <div className={styles.navbarContainer}>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/">Pingtoc</a>
          <a className={styles.rowItem} href="/">Mapa</a>
          <a className={styles.rowItem} href="/users">Usuarios</a>
        </div>
        <div>
          {logged ? 
            <div className={styles.row}>
              <a className={styles.rowItemPress} href="/users/pings">Pings</a>
              <a className={styles.rowItemPress} onClick={() => press()}>Perfil</a>   
              <a className={styles.rowItemPress} onClick={() => logout({ returnTo: window.location.origin })}>Cerrar Sesión</a>        
            </div>
            :
            <div className={styles.row}>
              <a className={styles.rowItemPress} onClick={() => handleLogin()}>Iniciar Sesión</a> 
            </div>            
          }          
        </div>
      </div>
    </header>
  )
}

export default Navbar